const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { LINE_CHANNEL_TOKEN } = require("../services/line_service");
const { pushMessage, multicastMessage } = require("../services/line_service");
const { db, admin } = require("../config/firebase");
const { checkFlex } = require("../flex/checkFlex");

exports.onCheckinUpdate = onDocumentWritten(
  {
    document: "Checkins/{checkinId}",
    region: "us-central1",
    secrets: [LINE_CHANNEL_TOKEN],
  },
  async (event) => {
    const before = event.data.before?.data() || null;
    const after = event.data.after?.data() || null;
    if (!after) return;

    const isCheckIn = after.status === "IN";
    const isCheckOut = after.status === "OUT" || after.status === "DONE";
    if (!isCheckIn && !isCheckOut) return;

    if (isCheckIn && after.lineNotifiedIn) return;
    if (isCheckOut && after.lineNotifiedOut) return;

    const photoUrl = isCheckIn
      ? after.checkInPhotoUrl
      : after.checkOutPhotoUrl;
    if (!photoUrl) return;

    const beforePhotoUrl = isCheckIn
      ? before?.checkInPhotoUrl
      : before?.checkOutPhotoUrl;
    if (beforePhotoUrl === photoUrl) return;

    const geo = isCheckIn ? after.checkInGeo : after.checkOutGeo;
    const timeStamp = isCheckIn ? after.checkInAt : after.checkOutAt;
    if (!geo || !timeStamp) return;

    const timeText = timeStamp.toDate().toLocaleString("th-TH", {
      timeZone: "Asia/Bangkok",
      hour: "2-digit",
      minute: "2-digit",
    });

    const dateText = timeStamp.toDate().toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const userSnap = await db.collection("Users").doc(after.userId).get();

    const userName =
      userSnap.exists
        ? userSnap.data().username ||
          userSnap.data().displayName ||
          "Anonymous"
        : "Anonymous";

    const flex = checkFlex({
      title: isCheckIn ? "CHECK IN" : "CHECK OUT",
      color: isCheckIn ? "#5EDD60" : "#E53935",
      dateText,
      userName: userName,
      timeText,
      photoUrl,
      lat: geo.lat,
      lng: geo.lng,
    });

    try {
      await pushMessage(after.userId, flex);
    } catch (e) {
      console.error("push user error", e.response?.data || e);
    }

    try {
      const adminSnap = await db
        .collection("Users")
        .where("role", "==", "Admin")
        .get();

      const actorUserId = after.userId;

      const adminIds = adminSnap.docs
        .map(d => d.data().userId)
        .filter(id => id !== actorUserId);

      if (adminIds.length) {
        await multicastMessage(adminIds, flex);
      }
    } catch (e) {
      console.error("multicast admin error", e.response?.data || e);
    }

    await event.data.after.ref.update({
      ...(isCheckIn
        ? { lineNotifiedIn: true }
        : { lineNotifiedOut: true }),
      lineNotifiedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
);
