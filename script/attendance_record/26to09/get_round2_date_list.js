import { getDateList } from "@/script/attendance_record/utils/get_date_list";

export function getRound2DateList(year, month) {
  const start = `${year}-${String(month).padStart(2, "0")}-26`;

  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  const end = `${nextYear}-${String(nextMonth).padStart(2, "0")}-09`;

  return getDateList(start, end);
}
