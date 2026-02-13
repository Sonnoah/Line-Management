export function getPayrollPeriodByMonth(mode, yearMonth) {
  const [year, month] = yearMonth.split("-").map(Number);

  if (mode === "10to25") {
    return {
      startDate: new Date(year, month - 1, 10),
      endDate: new Date(year, month - 1, 25),
    };
  }

  // 26–9
  return {
    startDate: new Date(year, month - 1, 26),
    endDate: new Date(year, month, 9),
  };
}
