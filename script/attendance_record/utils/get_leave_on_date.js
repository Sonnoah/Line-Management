export function getLeaveOnDate(leaves = [], userId, date) {
  return leaves.find(l => {
    if (l.userId !== userId || l.status !== "approved") return false;

    const start = l.start_date <= l.end_date ? l.start_date : l.end_date;
    const end = l.start_date <= l.end_date ? l.end_date : l.start_date;

    return start <= date && end >= date;
  }) || null;
}
