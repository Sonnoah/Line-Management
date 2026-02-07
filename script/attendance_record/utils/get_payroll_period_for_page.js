export function getPayrollPeriodForPage(pageType, baseDate = new Date()) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth(); // 0-based
  const day = baseDate.getDate();

  // ---------- PAGE 10–25 ----------
  if (pageType === "10to25") {
    // ถ้าวันนี้ >= 10 → ใช้เดือนปัจจุบัน
    // ถ้าวันนี้ < 10 → ใช้เดือนก่อน
    const targetMonth = day >= 10 ? month : month - 1;
    const targetYear = targetMonth < 0 ? year - 1 : year;
    const m = (targetMonth + 12) % 12;

    return {
      round: "10–25",
      startDate: new Date(targetYear, m, 10),
      endDate: new Date(targetYear, m, 25),
    };
  }

  // ---------- PAGE 26–9 ----------
  if (pageType === "26to09") {
    // ถ้าวันนี้ >= 26 → เริ่มเดือนนี้
    // ถ้าวันนี้ < 26 → เริ่มเดือนก่อน
    const startMonth = day >= 26 ? month : month - 1;
    const startYear = startMonth < 0 ? year - 1 : year;
    const sm = (startMonth + 12) % 12;

    const endMonth = sm === 11 ? 0 : sm + 1;
    const endYear = sm === 11 ? startYear + 1 : startYear;

    return {
      round: "26–9",
      startDate: new Date(startYear, sm, 26),
      endDate: new Date(endYear, endMonth, 9),
    };
  }

  throw new Error("Invalid pageType");
}
