import * as XLSX from "xlsx-js-style";
import { buildSummary } from "@/app/components/pages/build_summary";
import { getStatusText, addBorderToSheet, setFont, centerColumn} from "@/app/components/excel/excel_style";

export function exportAttendanceToExcel(rows, label) {

  if (!Array.isArray(rows) || rows.length === 0) {
    alert("ไม่มีข้อมูลสำหรับ export");
    return;
  }

  const workbook = XLSX.utils.book_new();

  // =====================================
  // 1️⃣ DAILY SHEET
  // =====================================

  const blankIfZero = (value) => value === 0 ? "" : value ?? "";

    const dailyData = rows.map(r => ({
    "No": r.no,
    "Name": r.name,
    "Date": r.date,
    "Department": r.department,
    "Scheduled Time": r.workStart || "",
    "": r.workEnd || "",
    "Check In": r.checkIn || "",
    "Check Out": r.checkOut || "",
    "Late (Min)": blankIfZero(r.late),
    "Overtime (Min)": blankIfZero(r.early),
    "Total": blankIfZero(r.total),
    "OT Total": r.ot > 0 ? r.ot : "",
    "OT Accumulated": blankIfZero(r.otAccum),
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
            fgColor: { rgb: "EEECE1" }
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

    // title //
    dailySheet[cellAddress].s = {
        font: { 
            bold: true,
            sz: 14   
        },
        fill: {
            patternType: "solid",
            fgColor: { rgb: "EEECE1" }
        },
        alignment: {
            horizontal: "center",
            vertical: "center"
        }
    };
  }
    // merge title
    dailySheet["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 1, c: 15 } }
    ];

    if (!dailySheet["!merges"]) dailySheet["!merges"] = [];

    dailySheet["!merges"].push({
        s: { r: 2, c: 4 }, // D3
        e: { r: 2, c: 5 }  // E3
    });


    addBorderToSheet(dailySheet);
    setFont(dailySheet);
    centerColumn(dailySheet);

    // 🎨 สี row ตาม status
    rows.forEach((r, rowIndex) => {

    const excelRow = rowIndex + 3; 

    let fillColor = null;

    if (r.isCompanyHoliday && r.workedOnHoliday) fillColor = "B1A0C7"; // สีเหลือง
    else if (r.workedOnHoliday) fillColor = "FFFF00"; // สีเหลือง
    else if (r.isCompanyHoliday) fillColor = "CCC0DA"; // สีม่วง
    else if (r.isHoliday) fillColor = "92D050"; // สีเขียว
    else if (r.status === "ABSENT") fillColor = "FF8B8B"; // สีแดง
    else if (r.leave) fillColor = "B7DEE8"; // สีฟ้า

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
        { wch: 12 },  // Department
        { wch: 10 },  // Scheduled In
        { wch: 10 },  // Scheduled Out
        { wch: 10 },  // Check In
        { wch: 10 },  // Check Out
        { wch: 10 },  // Late Minutes
        { wch: 14 },  // Overtime Minutes
        { wch: 10 },  // Total Minutes
        { wch: 10 },  // OT Total
        { wch: 15 },  // OT Accumulated
        { wch: 14 },  // Leave Type
        { wch: 16 },  // Status
        { wch: 18 },  // Remark
    ];
    dailySheet["!rows"] = [
        { hpt: 14 },
        { hpt: 14 },
        { hpt: 30 },     
    ];




  XLSX.utils.book_append_sheet(workbook, dailySheet, "Daily Report");


  // SUMMARY SHEET  //

  const summaryData = buildSummary(rows, label);

  const summarySheetData = summaryData.map(r => ({
    "Name": r.name,
    "Date": label,
    "Working Days": r.workingDays,
    "Holiday": r.holidays,
    "Net Late (min)": r.lateMinutes,
    "OT x 1": r.otTotal,
    "TO x 2": r.otTotalx2,
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

    // Headder //
    summarySheet[cellAddress].s = {
        font: { 
            bold: true,
        },
        fill: {
            patternType: "solid",
            fgColor: { rgb: "92D050" }   
        },
        alignment: {
            horizontal: "center",
            vertical: "center"
        }
    };
}


    for (let col = summaryRange.s.c; col <= summaryRange.e.c; col++) {
        
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });

    if (!summarySheet[cellAddress]) continue;

    summarySheet["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 1, c: 10 } }
    ];
    
    addBorderToSheet(summarySheet);
    setFont(summarySheet);

    // Title //
    summarySheet[cellAddress].s = {  
        font: { 
            bold: true,
            sz: 14   
        },
        fill: {
            patternType: "solid",
            fgColor: { rgb: "92D050" }
        },
        alignment: {
            horizontal: "center",
            vertical: "center"
        }
    };

}

    for (let col = 7; col <= 10; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 2, c: col });

        if (!summarySheet[cellAddress]) continue;

        summarySheet[cellAddress].s = {
            ...summarySheet[cellAddress].s,
            fill: {
            patternType: "solid",
            fgColor: { rgb: "FFFF00" } 
            }
        };
    }   

    for (let col = 5; col <= 6; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 2, c: col });

    if (summarySheet[cellAddress]) {
        summarySheet[cellAddress].s = {
            ...summarySheet[cellAddress].s,
            fill: {
            patternType: "solid",
            fgColor: { rgb: "92CDDC" } 
            }
        };
    } 
}

    summarySheet["!cols"] = [
        { wch: 22 },  // Name
        { wch: 25 },  // Date
        { wch: 14 },  // Working Days
        { wch: 12 },  // Holiday
        { wch: 16 },  // Late Minutes
        { wch: 13 },  // OT x 1
        { wch: 13 },  // OT x 2
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
