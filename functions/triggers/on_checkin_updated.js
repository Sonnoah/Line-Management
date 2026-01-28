const functions = require("firebase-functions");
const { admin, db } = require("./firebase");
const { pushMessage } = require("./line");

const ADMIN_USER_ID = functions.config().line.admin_user_id;

exports.onCheckinUpdated = functions.firestore
  .document("Checkins/{checkinId}")
  .onWrite(async (change, context) => {
    if (!change.after.exists) return;

    const before = change.before.data();
    const after = change.after.data();

    if (before?.status === after.status) return;

    if (after.lineNotified) return;

    const {
      userId,
      status,
      checkInAt,
      checkOutAt,
      checkInGeo,
      checkOutGeo,
      checkInPhoto,
      checkOutPhoto,
      userName,
      displayName,
    } = after;

    const isCheckIn = status === "IN";
    const isCheckOut = status === "OUT" || status === "DONE";

    if (!isCheckIn && !isCheckOut) return;

    const timeStamp = isCheckIn ? checkInAt : checkOutAt;
    const geo = isCheckIn ? checkInGeo : checkOutGeo;
    const photoUrl = isCheckIn ? checkInPhoto : checkOutPhoto;

    if (!timeStamp || !geo || !photoUrl) return;

    const timeText = timeStamp.toDate().toLocaleString("th-TH", {
      timeZone: "Asia/Bangkok",
      hour: "2-digit",
      minute: "2-digit",
    });

    const flexMessage = buildFlexMessage({
      title: isCheckIn ? "CHECK IN" : "CHECK OUT",
      color: isCheckIn ? "#5EDD60" : "#E53935",
      userName: userName || displayName || "",
      timeText,
      photoUrl,
      lat: geo.lat,
      lng: geo.lng,
    });

    await pushMessage(userId, flexMessage);

    await pushMessage(ADMIN_USER_ID, flexMessage);

    await change.after.ref.update({
      lineNotified: true,
      lineNotifiedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });
