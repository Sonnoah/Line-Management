import * as XLSX from "xlsx-js-style";
import { buildSummary } from "@/script/attendance_record/utils/build_summary";
import { getStatusText, addBorderToSheet } from "@/script/attendance_record/excel_style";

export function exportAttendanceToExcel(rows, label) {

  if (!Array.isArray(rows) || rows.length === 0) {
    alert("ไม่มีข้อมูลสำหรับ export");
    return;
  }

  const workbook = XLSX.utils.book_new();

  // =====================================
  // 1️⃣ DAILY SHEET
  // =====================================

  const dailyData = rows.map(r => ({
    "No": r.no,
    "Name": r.name,
    "Date": r.date,
    "Scheduled In": r.workStart || "",
    "Scheduled Out": r.workEnd || "",
    "Check In": r.checkIn || "",
    "Check Out": r.checkOut || "",
    "Late (Min)": r.late || 0,
    "Overtime (Min)": r.early || 0,
    "Total": r.total ?? "",
    "OT Total": r.ot ?? "",
    "OT Accumulated": r.otAccum ?? "",
    "Leave Type": r.leaveType || "",
    "Status": getStatusText(r),
    "Remark": r.remark || ""
  }));

  const dailySheet = XLSX.utils.json_to_sheet([]);

  XLSX.utils.sheet_add_aoa(dailySheet, [
    [`Daily Report (${label})`],
    []
  ]);

  XLSX.utils.sheet_add_json(dailySheet, dailyData, {
    origin: "A3",
    skipHeader: false
  });

  const dailyRange = XLSX.utils.decode_range(dailySheet["!ref"]);


  for (let col = dailyRange.s.c; col <= dailyRange.e.c; col++) {

    const cellAddress = XLSX.utils.encode_cell({ r: 2, c: col });

    if (!dailySheet[cellAddress]) continue;

    dailySheet[cellAddress].s = {
        font: { bold: true },
        fill: {
            patternType: "solid",
            fgColor: { rgb: "9370db" }
        },
        alignment: {
            horizontal: "center",
            vertical: "center"
        }
    };
}

  for (let col = dailyRange.s.c; col <= dailyRange.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });

    if (!dailySheet[cellAddress]) continue;

    dailySheet[cellAddress].s = {
      font: { bold: true },
      fill: {
        patternType: "solid",
        fgColor: { rgb: "D9D9D9" }
      }
    };
  }

    // merge title
    dailySheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 14 } }
    ];

    // ใส่ border ทั้ง sheet ก่อน
    addBorderToSheet(dailySheet);

    // 🎨 สี row ตาม status
    rows.forEach((r, rowIndex) => {

    const excelRow = rowIndex + 3; 

    let fillColor = null;

    if (r.workedOnHoliday) fillColor = "ffff00";
    else if (r.isHoliday) fillColor = "32cd32";
    else if (r.status === "ABSENT") fillColor = "ff0000";
    else if (r.leave) fillColor = "87cefa";

    if (!fillColor) return;

    for (let col = dailyRange.s.c; col <= dailyRange.e.c; col++) {

        const cellAddress = XLSX.utils.encode_cell({
        r: excelRow,
        c: col
        });

        if (!dailySheet[cellAddress]) continue;

        dailySheet[cellAddress].s = {
        ...dailySheet[cellAddress].s,   
        fill: {
            patternType: "solid",
            fgColor: { rgb: fillColor }
        }
        };
    }
    });

    dailySheet["!cols"] = [
        { wch: 4  },   // No
        { wch: 21 },  // Name
        { wch: 12 },  // Date
        { wch: 12 },  // Scheduled In
        { wch: 12 },  // Scheduled Out
        { wch: 10 },  // Check In
        { wch: 10 },  // Check Out
        { wch: 10 },  // Late Minutes
        { wch: 14 },  // Overtime Minutes
        { wch: 10 },  // Total Minutes
        { wch: 10 },  // OT Total
        { wch: 14 },  // OT Accumulated
        { wch: 13 },  // Leave Type
        { wch: 13 },  // Status
        { wch: 16 },  // Remark
    ];
    dailySheet["!rows"] = [
        { hpt: 14 },
        { hpt: 14 },
        { hpt: 30 },     
    ];




  XLSX.utils.book_append_sheet(workbook, dailySheet, "Daily Report");

  // =====================================
  // 2️⃣ SUMMARY SHEET
  // =====================================

  const summaryData = buildSummary(rows, label);

  const summarySheetData = summaryData.map(r => ({
    "Name": r.name,
    "Date": label,
    "Working Days": r.workingDays,
    "Holiday": r.holidays,
    "Late - No Time Offset (Min)": r.lateMinutes,
    "Total OT": r.otTotal,
    "Private Pay": r.leaveWithPay,
    "Private No Pay": r.leaveNoPay,
    "Annual Leave": r.leaveAnnual,
    "Sick Leave": r.leaveSick
  }));

    const summarySheet = XLSX.utils.json_to_sheet([]);
    

    XLSX.utils.sheet_add_aoa(summarySheet, [
        [`Summary Report (${label})`],
        []
    ]);

    XLSX.utils.sheet_add_json(summarySheet, summarySheetData, {
        origin: "A3",
        skipHeader: false
    });

    const summaryRange = XLSX.utils.decode_range(summarySheet["!ref"]);

    for (let col = summaryRange.s.c; col <= summaryRange.e.c; col++) {

    const cellAddress = XLSX.utils.encode_cell({ r: 2, c: col });

    if (!summarySheet[cellAddress]) continue;

    summarySheet[cellAddress].s = {
        font: { bold: true },
        alignment: {
            horizontal: "center",
            vertical: "center"
        }
    };
    }


    // header style Summary
    for (let col = summaryRange.s.c; col <= summaryRange.e.c; col++) {
        
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });

    if (!summarySheet[cellAddress]) continue;

    summarySheet["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 9 } }
    ];
    
    addBorderToSheet(summarySheet);

    summarySheet[cellAddress].s = {  
        font: { bold: true },
        fill: {
        patternType: "solid",
        fgColor: { rgb: "D9D9D9" }
        }
    };

}
    rows.forEach((r, rowIndex) => {

    const excelRow = rowIndex + 1; // ✅ FIX (data เริ่ม row 3)

    let fillColor = null;

    if (r.leave) fillColor = "32cd32";

    if (!fillColor) return;

    for (let col = summaryRange.s.c; col <= summaryRange.e.c; col++) {

        const cellAddress = XLSX.utils.encode_cell({
        r: excelRow,
        c: col
        });

        if (!summarySheet[cellAddress]) continue;

        summarySheet[cellAddress].s = {
        ...summarySheet[cellAddress].s,   
        fill: {
            patternType: "solid",
            fgColor: { rgb: fillColor }
        }
        };
    }
    });

    summarySheet["!cols"] = [
        { wch: 22 },  // Name
        { wch: 25 },  // Date
        { wch: 14 },  // Working Days
        { wch: 12 },  // Holiday
        { wch: 22 },  // Late Minutes
        { wch: 13 },  // Total OT
        { wch: 16 },  // Private Pay
        { wch: 18 },  // Private No Pay
        { wch: 16 },  // Annual Leave
        { wch: 14 },  // Sick Leave
    ];
    summarySheet["!rows"] = [
        { hpt: 14 },
        { hpt: 14 },
        { hpt: 30 },     
    ];



    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary Report");

    // =====================================
    // SAVE FILE
    // =====================================

    const safeLabel = label.replace(/[^\w\-]+/g, "_");

    XLSX.writeFile(
        workbook,
        `attendance_${safeLabel}_${new Date().toISOString().slice(0,10)}.xlsx`
    );
}
