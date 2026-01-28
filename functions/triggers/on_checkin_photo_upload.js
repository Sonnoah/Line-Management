const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { admin } = require("../config/firebase");
const { uploadBase64ToStorage } = require("../src/upload_image");

exports.onCheckinPhotoUpload = onDocumentWritten(
  { document: "Checkins/{checkinId}" },
  async (event) => {
    const after = event.data.after.exists ? event.data.after.data() : null;
    if (!after) return;

    const isCheckIn = after.status === "IN";
    const isCheckOut = after.status === "OUT" || after.status === "DONE";

    const base64 = isCheckIn
      ? after.checkInPhoto
      : after.checkOutPhoto;

    if (!base64) return;
    if (
      (isCheckIn && after.checkInPhotoUrl) ||
      (isCheckOut && after.checkOutPhotoUrl)
    ) {
      return;
    }

    const imageUrl = await uploadBase64ToStorage(
      base64,
      `checkins/${event.params.checkinId}_${after.status}.jpg`
    );

    const update = {
      photoUploadedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (isCheckIn) {
      update.checkInPhotoUrl = imageUrl;
      update.checkInPhoto = admin.firestore.FieldValue.delete();
    } else {
      update.checkOutPhotoUrl = imageUrl;
      update.checkOutPhoto = admin.firestore.FieldValue.delete();
    }

    await event.data.after.ref.update(update);
  }
);
