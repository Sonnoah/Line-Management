const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { LINE_CHANNEL_ACCESS_TOKEN } = require("../services/line_service");
const { pushMessage, multicastMessage } = require("../services/line_service");
const { db, admin } = require("../config/firebase");

function checkFlex({
  title,
  color,
  userName,
  timeText,
  photoUrl,
  lat,
  lng,
}) {
  return {
    type: "flex",
    altText: `${title} - ${userName}`,
    contents: {
      type: "bubble",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: color,
        contents: [
          {
            type: "text",
            text: title,
            weight: "bold",
            size: "lg",
            align: "center",
            color: "#FFFFFF",
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
         {
          type: "image",
          url: photoUrl,
          size: "full",
          aspectRatio: "4:3",
          aspectMode: "cover",
            action: {
              type: "uri",
              uri: photoUrl, 
            },
          },
          {
            type: "text",
            text: `Name: ${userName}`,
            wrap: true,
          },
          {
            type: "text",
            text: `Time: ${timeText}`,
            wrap: true,
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            style: "link",
            action: {
              type: "uri",
              label: "Location",
              uri: `https://www.google.com/maps?q=${lat},${lng}`,
            },
          },
        ],
      },
    },
  };
}

exports.onCheckinUpdate = onDocumentWritten(
  {
    document: "Checkins/{checkinId}",
    region: "us-central1",
    secrets: [LINE_CHANNEL_ACCESS_TOKEN],
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

    const flex = checkFlex({
      title: isCheckIn ? "CHECK IN" : "CHECK OUT",
      color: isCheckIn ? "#5EDD60" : "#E53935",
      userName: after.userName || after.displayName || "Employee",
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
