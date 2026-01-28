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

/* ================= FIRESTORE TRIGGER ================= */
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

    // กันยิงซ้ำ
    if (after.lineNotified) return;

    const isCheckIn = after.status === "IN";
    const isCheckOut = after.status === "OUT" || after.status === "DONE";
    if (!isCheckIn && !isCheckOut) return;

    const photoUrl = isCheckIn
      ? after.checkInPhotoUrl
      : after.checkOutPhotoUrl;
    if (!photoUrl) return;

    // ยิงเฉพาะตอนรูป URL เพิ่งมา
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

    /* ===== ส่งให้ USER (เหมือน Leave Request) ===== */
    try {
      await pushMessage(after.userId, flex);
    } catch (e) {
      console.error("❌ push user error", e.response?.data || e);
    }

    /* ===== ส่งให้ ADMIN ทุกคน ===== */
    try {
      const adminSnap = await db
        .collection("Users")
        .where("role", "==", "Admin")
        .get();

      const adminIds = adminSnap.docs.map(d => d.data().userId);

      if (adminIds.length) {
        await multicastMessage(adminIds, flex);
      }
    } catch (e) {
      console.error("❌ multicast admin error", e.response?.data || e);
    }

    /* ===== mark ว่าส่งแล้ว ===== */
    await event.data.after.ref.update({
      lineNotified: true,
      lineNotifiedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
);
