export function getRound2Ranges(year, month) {
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  return [
    {
      start: `${year}-${String(month).padStart(2, "0")}-26`,
      end: `${year}-${String(month).padStart(2, "0")}-${getLastDay(year, month)}`,
    },
    {
      start: `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`,
      end: `${nextYear}-${String(nextMonth).padStart(2, "0")}-09`,
    },
  ];
}

function getLastDay(year, month) {
  return new Date(year, month, 0).getDate();
}
