import { getDateList } from "@/script/attendance_record/utils/get_date_list";

export function getRound1DateList(year, month) {
  const start = `${year}-${String(month).padStart(2, "0")}-10`;
  const end   = `${year}-${String(month).padStart(2, "0")}-25`;

  return getDateList(start, end);
}
