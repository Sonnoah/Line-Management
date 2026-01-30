const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const admin = require("firebase-admin");

admin.initializeApp();
const db = getFirestore();

function getWorkMinutesByDepartment(department) {
  if (department === "Production") return 8 * 60;
  if (department === "Office") return 9 * 60;
  return 9 * 60;
}

exports.calculateWorkTime = onDocumentUpdated(
  "Checkins/{checkinId}",
  async (event) => {
    const before = event.data.before.data();
    const after = event.data.after.data();

    if (after.calculated) return;
    if (!after.checkOut?.time || before.checkOut?.time) return;

    const checkInAt = after.checkIn.time.toDate();
    const checkOutAt = after.checkOut.time.toDate();

    const workedMinutes = Math.floor(
      (checkOutAt - checkInAt) / 60000
    );

    const department = after.department || "Office";
    const requiredMinutes =
      getWorkMinutesByDepartment(department);

    const overtimeMinutes = Math.max(
      0,
      workedMinutes - requiredMinutes
    );
    const missingMinutes = Math.max(
      0,
      requiredMinutes - workedMinutes
    );

    await event.data.after.ref.update({
      workedMinutes,
      workedHours: workedMinutes / 60,

      requiredMinutes,
      requiredHours: requiredMinutes / 60,

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
