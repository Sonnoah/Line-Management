export function getDateList(start, end) {
  const dates = [];

  const [sy, sm, sd] = start.split("-").map(Number);
  const [ey, em, ed] = end.split("-").map(Number);

  let current = new Date(sy, sm - 1, sd);
  const last = new Date(ey, em - 1, ed);

  while (current <= last) {
    dates.push(
      `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`
    );
    current.setDate(current.getDate() + 1);
  }

  return dates;
}
