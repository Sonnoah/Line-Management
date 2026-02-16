export function isCompanyHoliday(date, holidays) {
  return holidays.some(h => h.date === date);
}
