export function formatThaiDate(date) {
  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function dateToYMD(date) {
  return date.toISOString().slice(0, 10);
}

export function getRowClass(row) {
  if (row.workedOnHoliday) {
    return "bg-yellow-100 text-yellow-900";
  }

  if (row.isHoliday) {
    return "bg-green-100";
  }

  if (row.status === "ABSENT") {
    return "bg-red-50";
  }

  return "";
}

export function parseLocalDate(dateStr, options = { be: false }) {
  const [y, m, d] = dateStr.split("-").map(Number);

  const yearAD = options.be ? y - 543 : y;

  return new Date(yearAD, m - 1, d);
}

export function getTodayRound(baseDate = new Date()) {
  const day = baseDate.getDate();

  if (day >= 10 && day <= 25) return 1;   
  return 2;                             
}

