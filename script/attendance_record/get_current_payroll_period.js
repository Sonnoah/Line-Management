
export function getCurrentPayrollPeriod(round = 1, baseDate = new Date()) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth() + 1; // 1-12

  if (round === 1) {
    return {
      round: "10–25",
      startDate: new Date(year, month - 1, 10),
      endDate: new Date(year, month - 1, 25),
    };
  }


  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  return {
    round: "26–9",
    startDate: new Date(year, month - 1, 26),
    endDate: new Date(nextYear, nextMonth - 1, 9),
  };
}
