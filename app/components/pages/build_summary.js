export function buildSummary(rows, label) {
  const map = {};

  rows.forEach(r => {
    if (!map[r.userId]) {
      map[r.userId] = {
        userId: r.userId,
        name: r.name,
        period: label,

        workingDays: 0,
        holidays: 0,
        lateMinutes: 0,
        otTotal: 0,

        leaveWithPay: 0,
        leaveNoPay: 0,
        leaveAnnual: 0,
        leaveSick: 0,

        otAccum: 0 
      };
    }

    const u = map[r.userId];

    const hasFullCheck = r.checkIn && r.checkOut;

    if (hasFullCheck) {
      u.workingDays += 1;
    }

    if (r.isCompanyHoliday || r.isHoliday) {
      u.holidays += 1;
    }

    // ✅ เก็บค่า otAccum ล่าสุด (ไม่บวกสะสม)
    if (typeof r.otAccum === "number") {
      u.otAccum = r.otAccum;
    }

    // ✅ ลา
    if (r.leave) {
      switch (r.leaveType) {
        case "Private pay":
          u.leaveWithPay += 1;
          break;
        case "Private no pay":
          u.leaveNoPay += 1;
          break;
        case "Annual":
          u.leaveAnnual += 1;
          break;
        case "Sick":
          u.leaveSick += 1;
          break;
      }
    }
  });

  // ✅ คำนวณ OT / Late หลัง loop จบ
  Object.values(map).forEach(u => {
    if (typeof u.otAccum === "number") {
      if (u.otAccum < 0) {
        u.lateMinutes = Math.abs(u.otAccum);
        u.otTotal = 0;
      } else if (u.otAccum > 0) {
        u.otTotal = Number((u.otAccum / 60).toFixed(2));
        u.lateMinutes = 0;
      }
    }
  });

  return Object.values(map);
}
