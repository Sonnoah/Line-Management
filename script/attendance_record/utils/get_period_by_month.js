export function getPayrollPeriodByMonth(mode, baseDate) {
  const y = baseDate.getFullYear();
  const m = baseDate.getMonth();

  if (mode === "10to25") {
    return {
      startDate: new Date(y, m, 10),
      endDate: new Date(y, m, 25),
    };
  }

  // 26–9
  return {
    startDate: new Date(y, m, 26),
    endDate: new Date(m === 11 ? y + 1 : y, (m + 1) % 12, 9),
  };
}
