export function formatThaiDate(date) {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Bangkok"
  });
}

export function getRowClass(row) {

  if (row.isCompanyHoliday) {
    return "bg-purple-100 text-purple-900";
  }

  if (row.workedOnHoliday) {
    return "bg-warning/20 text-warning-content";
  }

  if (row.isHoliday) {
    return "bg-success/20 text-success-content";
  }

  if (row.status === "ABSENT") {
    return "bg-error/20 text-error-content";
  }

  if (row.leave) {
    return "bg-info/20 text-info-content";
  }

  return "";
}

export function parseLocalDate(dateStr, options = { be: false }) {
  const [y, m, d] = dateStr.split("-").map(Number);

  const yearAD = options.be ? y - 543 : y;
  
  return new Date(Date.UTC(yearAD, m - 1, d));
}


export function dateToYMD(date = new Date()) {
  return date.toLocaleDateString("en-CA", {
    timeZone: "Asia/Bangkok",
  });
}


export function getTodayRound(baseDate = new Date()) {
  const day = baseDate.getDate();

  if (day >= 10 && day <= 25) return 1;   
  return 2;                             
}


export function toJSDate(value) {
  if (!value) return null;

  if (typeof value.toDate === "function") {
    return value.toDate();
  }

  if (typeof value.seconds === "number") {
    return new Date(value.seconds * 1000);
  }

  if (value instanceof Date) {
    return value;
  }

  return null;
}
