import * as XLSX from "xlsx-js-style";

export function getStatusText(r) {
  if (r.isCompanyHoliday && r.workedOnHoliday) return "Holiday Work";
  if (r.workedOnHoliday) return "Weekend Work";
  if (r.isCompanyHoliday) return "Holiday";
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

export function setFont(sheet) {

  if (!sheet["!ref"]) return;

  const range = XLSX.utils.decode_range(sheet["!ref"]);

  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {

      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });

      if (!sheet[cellAddress]) continue;

      sheet[cellAddress].s = {
        ...sheet[cellAddress].s,
        font: {
          ...sheet[cellAddress].s?.font,
          name: "Tahoma",
          sz: 10,
        }
      };
    }
  }
}

export function centerColumn(sheet) {
  if (!sheet["!ref"]) return;

  const range = XLSX.utils.decode_range(sheet["!ref"]);

  const targetCols = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; 

  for (let row = range.s.r; row <= range.e.r; row++) {

    targetCols.forEach(col => {

      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });

      if (!sheet[cellAddress]) return;

      sheet[cellAddress].s = {
        ...sheet[cellAddress].s,
        alignment: {
          horizontal: "center",
          vertical: "center"
        }
      };

    });
  }
}

