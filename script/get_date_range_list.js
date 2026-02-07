export function getDateRangeList(startDate, endDate) {
  const dates = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    dates.push(current.toISOString().slice(0, 10)); 
    current.setDate(current.getDate() + 1);
  }

  return dates;
}