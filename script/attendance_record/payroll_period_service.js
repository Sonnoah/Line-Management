const HOLD_DAYS = 10;

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function isExpired(closedAt) {
  if (!closedAt) return false;
  return new Date() > addDays(new Date(closedAt), HOLD_DAYS);
}

function getCalendarPeriod(pageType, today = new Date()) {
  const y = today.getFullYear();
  const m = today.getMonth();
  const d = today.getDate();

  if (pageType === "10to25") {
    // วันที่ 1–9 → เตรียมรอบเดือนนี้
    return {
      round: "10–25",
      startDate: new Date(y, m, 10),
      endDate: new Date(y, m, 25),
      closedAt: null,
    };
  }

  // 26–9 (กลุ่มเดียว)
  const startMonth = d >= 26 ? m : m - 1;
  const startYear = startMonth < 0 ? y - 1 : y;
  const sm = (startMonth + 12) % 12;

  return {
    round: "26–09",
    startDate: new Date(startYear, sm, 26),
    endDate: new Date(
      sm === 11 ? startYear + 1 : startYear,
      (sm + 1) % 12,
      9
    ),
    closedAt: null,
  };
}

export function getEffectivePayrollPeriod(pageType, activeConfig) {
  // 1️⃣ ถ้ารอบเก่ายังไม่หมดอายุ → ใช้รอบเดิม
  if (activeConfig && !isExpired(activeConfig.closedAt)) {
    return activeConfig;
  }

  // 2️⃣ ถ้าหมดอายุ → ใช้รอบตามปฏิทินปัจจุบัน
  return getCalendarPeriod(pageType);
}
