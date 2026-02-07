export function buildPayrollTable(users, checkins, dates) {
  const table = {};

  users.forEach(u => {
    table[u.userId] = {
      user: u,
      days: {},
      summary: {
        workedMinutes: 0,
        missingMinutes: 0,
        overtimeMinutes: 0,
      },
    };

    dates.forEach(date => {
      table[u.userId].days[date] = null;
    });
  });

  checkins.forEach(ci => {
    const row = table[ci.userId];
    if (!row) return;

    row.days[ci.date] = {
      status: ci.status,
      workedMinutes: ci.workedMinutes,
      missingMinutes: ci.missingMinutes,
      overtimeMinutes: ci.overtimeMinutes,
      checkInAt: ci.checkInAt,
      checkOutAt: ci.checkOutAt,
    };

    row.summary.workedMinutes += ci.workedMinutes || 0;
    row.summary.missingMinutes += ci.missingMinutes || 0;
    row.summary.overtimeMinutes += ci.overtimeMinutes || 0;
  });

  return table;
}
