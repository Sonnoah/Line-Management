export function getCurrentPayrollPeriod(baseDate = new Date()) {
  if (!(baseDate instanceof Date)) {
    baseDate = new Date(baseDate);
  }

  if (isNaN(baseDate)) {
    throw new Error("Invalid baseDate passed to getCurrentPayrollPeriod");
  }

  const year = baseDate.getFullYear();
  const month = baseDate.getMonth(); 
  const day = baseDate.getDate();

  if (day >= 10 && day <= 25) {
    return {
      round: "10–25",
      startDate: new Date(year, month, 10),
      endDate: new Date(year, month, 25),
    };
  }

  if (day >= 26) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    return {
      round: "26–9",
      startDate: new Date(year, month, 26),
      endDate: new Date(nextYear, nextMonth, 9),
    };
  }

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;

  return {
    round: "26–9",
    startDate: new Date(prevYear, prevMonth, 26),
    endDate: new Date(year, month, 9),
  };
  
}

