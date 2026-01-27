const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const admin = require("firebase-admin");

admin.initializeApp();
const db = getFirestore();

const WORK_MINUTES_PER_DAY = 9 * 60;

exports.calculateWorkTime = onDocumentUpdated(
  "Checkins/{checkinId}",
  async (event) => {
    const before = event.data.before.data();
    const after = event.data.after.data();

    if (!after.checkOutAt || before.checkOutAt) return;

    const checkInAt = after.checkInAt.toDate();
    const checkOutAt = after.checkOutAt.toDate();

    const workedMinutes = Math.floor(
      (checkOutAt - checkInAt) / 60000
    );

    let overtimeMinutes = 0;
    let missingMinutes = 0;

    if (workedMinutes > WORK_MINUTES_PER_DAY) {
      overtimeMinutes = workedMinutes - WORK_MINUTES_PER_DAY;
    } else if (workedMinutes < WORK_MINUTES_PER_DAY) {
      missingMinutes = WORK_MINUTES_PER_DAY - workedMinutes;
    }

    await event.data.after.ref.update({
      workedMinutes,
      workedHours: workedMinutes / 60,

      overtimeMinutes,
      overtimeHours: overtimeMinutes / 60,

      missingMinutes,
      missingHours: missingMinutes / 60,

      status: "DONE",
      calculated: true,
      updatedAt: Timestamp.now(),
    });
  }
);
