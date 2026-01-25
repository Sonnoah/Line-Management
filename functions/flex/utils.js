function formatTimestamp(ts) {
  if (!ts) return "-";

  const date =
    typeof ts?.toDate === "function"
      ? ts.toDate()
      : new Date(ts);

  if (isNaN(date)) return "-";

  return date.toLocaleString("en-US", {
    timeZone: "Asia/Bangkok",
    dateStyle: "long",
    timeStyle: "short",
    hour12: false,
  });
}

module.exports = {
  formatTimestamp,
};
