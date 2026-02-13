const HOLD_DAYS = 10;

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function isExpired(closedAt) {
  if (!closedAt) return false; // ⬅️ สำคัญมาก
  return new Date() > addDays(new Date(closedAt), HOLD_DAYS);
}

function createLocalDate(y, m, d) {
  return new Date(Date.UTC(y, m, d));
}


export function getEffectivePayrollPeriod(pageType, config = {}) {
  const safeConfig = {
    active10to25: null,
    active26to09: null,
    ...config, // ของจริงทับ default
  };

  const active =
    pageType === "10to25"
      ? safeConfig.active10to25
      : safeConfig.active26to09;

  // ✅ ถ้ามีรอบ และยังไม่หมดอายุ → ใช้รอบเดิม
  if (active && !isExpired(active.closedAt)) {
    return active;
  }

  // ❌ ไม่มีรอบ หรือ หมดอายุ → สร้างใหม่จากปฏิทิน
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();

  if (pageType === "10to25") {
    return {
      round: "10–25",
      startDate: createLocalDate(y, m, 10),
      endDate: createLocalDate(y, m, 25),
      closedAt: null,
    };
  }

  return {
    round: "26–9",
    startDate: createLocalDate(y, m, 26),
    endDate: createLocalDate(
      m === 11 ? y + 1 : y,
      (m + 1) % 12,
      9
    ),
    closedAt: null,
  };
}

