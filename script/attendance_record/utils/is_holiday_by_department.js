import { parseLocalDate } from "./format_thai_date";

export function isHolidayByDepartment(dateStr, department, isBE = false) {
  const date = parseLocalDate(dateStr, { be: isBE });
  const day = date.getDay(); // 0=อาทิตย์, 6=เสาร์

  if (department === "Office") {
    return day === 0 || day === 6; // เสาร์ + อาทิตย์
  }
  if (department === "Production") {
    return day === 0; // อาทิตย์
  }
  return false;
}
