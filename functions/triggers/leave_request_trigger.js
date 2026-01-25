const { db } = require("../config/firebase");
const { pushMessage, multicastMessage, LINE_CHANNEL_ACCESS_TOKEN } = require("../services/line_service");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");

const userFlex = require("../flex/user_flex");
const adminFlex = require("../flex/admin_flex");

exports.onLeaveRequestCreated = onDocumentCreated(
  {
    document: "Request/{docId}",
    region: "us-central1",
    secrets: [LINE_CHANNEL_ACCESS_TOKEN],
  },
  async (event) => {
    const requestData = event.data.data();
    const docId = event.params.docId;

    if (!requestData?.userId) return;

    const userSnap = await db
      .collection("Users")
      .doc(requestData.userId)
      .get();

    const userData = userSnap.exists ? userSnap.data() : {};

    const payload = {
      ...requestData,
      pictureUrl: userData.pictureUrl,
      displayName: userData.displayName,
    };

    await pushMessage(requestData.userId, userFlex(payload));

    const adminSnap = await db
      .collection("Users")
      .where("role", "==", "Admin")
      .get();

    const adminIds = adminSnap.docs.map(d => d.data().userId);

    if (adminIds.length) {
      await multicastMessage(adminIds, {
        type: "flex",
        altText: "New Leave Request",
        contents: adminFlex(docId, payload),
      });
    }
  }
);
