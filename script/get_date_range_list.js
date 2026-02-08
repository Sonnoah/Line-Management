import { dateToYMD } from "./attendance_record/utils/format_thai_date";

export function getDateRangeList(startDate, endDate) {
  const dates = [];

  let current = new Date(startDate);
  const last = new Date(endDate);

  while (current <= last) {
    dates.push(dateToYMD(current)); 
    current.setDate(current.getDate() + 1);
  }

  return dates;
}
