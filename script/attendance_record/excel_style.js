import * as XLSX from "xlsx-js-style";

export function getStatusText(r) {
  if (r.workedOnHoliday) return "Weekend Work";
  if (r.isHoliday) return "Day Off";
  if (r.status === "ABSENT") return "Absent";
  if (r.leave) return "Leave";
  return "";
}

export function addBorderToSheet(sheet) {
  const range = XLSX.utils.decode_range(sheet["!ref"]);

  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {

      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });

      if (!sheet[cellAddress]) continue;

      sheet[cellAddress].s = {
        ...sheet[cellAddress].s,
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" }
        }
      };
    }
  }
}
