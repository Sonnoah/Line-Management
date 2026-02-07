import { parseLocalDate } from "./format_thai_date";

export function isHolidayByDepartment(dateStr, department, isBE = false) {
  const date = parseLocalDate(dateStr, { be: isBE });
  const day = date.getDay(); 

  if (department === "Office") {
    return day === 0 || day === 6; 
  }
  if (department === "Production") {
    return day === 0; 
  }
  return false;
}
