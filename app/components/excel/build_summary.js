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
      };
    }

    const u = map[r.userId];

    const hasFullCheck = r.checkIn && r.checkOut;

    // ✅ วันทำงาน = มี checkin + checkout
    if (hasFullCheck) {
      u.workingDays += 1;
    }

     if (r.isCompanyHoliday) {
      u.holidays += 1;
    }

    // ✅ วันหยุดบริษัท 
    if (r.isHoliday) {
      u.holidays += 1;
    }

    // ✅ สาย
    if (typeof r.otAccum === "number" && r.otAccum < 0) {
      u.lateMinutes += Math.abs(r.otAccum);
    }

    // ✅ OT
    if (typeof r.ot === "number" && r.ot > 0) {
      u.otTotal = Number((u.otTotal + r.ot / 60).toFixed(2));
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

  return Object.values(map);
}
