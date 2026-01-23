export function formatDateTime(ts) {
  if (!ts) return "-";

  const date =
    typeof ts?.toDate === "function"
      ? ts.toDate() 
      : new Date(ts); 

  if (isNaN(date)) return "-";

  return date.toLocaleString("th-TH", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, 
  });
}
