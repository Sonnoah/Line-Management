const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.onLeaveApproved = onDocumentUpdated(
  "Request/{requestId}",
  async (event) => {
    const before = event.data.before.data();
    const after = event.data.after.data();

    if (before.status === "approved") return;
    if (after.status !== "approved") return;

    const { userId, type } = after;
    const year = new Date().getFullYear();

    const quotaRef = db
      .collection("LeaveQuota")
      .doc(`${userId}_${year}`);

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(quotaRef);

      const field =
        type === "Private pay"
          ? "privatePayUsed"
          : type === "Annual"
          ? "annualUsed"
          : null;

      if (!field) return;

      if (!snap.exists) {
        tx.set(quotaRef, {
          userId,
          year,
          privatePayUsed: type === "Private pay" ? 1 : 0,
          annualUsed: type === "Annual" ? 1 : 0,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        tx.update(quotaRef, {
          [field]: admin.firestore.FieldValue.increment(1),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    });
  }
);
