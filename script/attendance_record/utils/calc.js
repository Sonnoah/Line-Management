function toJSDate(value) {
  if (!value) return null;

  if (typeof value.toDate === "function") {
    return value.toDate();
  }

  if (value.seconds) {
    return new Date(value.seconds * 1000);
  }

  if (value instanceof Date) {
    return value;
  }

  return null;
}

export function timeStrToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

export function calcLateMinutes(checkInDate, workStartStr) {
  if (!checkInDate || !workStartStr) return 0;

  const [startH, startM] = workStartStr.split(":").map(Number);

  const workStart = new Date(checkInDate);
  workStart.setHours(startH, startM, 0, 0);

  if (checkInDate <= workStart) return 0;

  return Math.floor((checkInDate - workStart) / (1000 * 60));
}



export function calcEarlyMinutes(
  checkInAt,
  checkOutAt,
  workStart,
  workEnd
) {
  const outDate = toJSDate(checkOutAt);
  if (!outDate) return 0;

  // เอาวันเดียวกันของ checkOut มาเป็นฐาน
  const workEndDate = new Date(outDate);

  const [endH, endM] = workEnd.split(":").map(Number);
  workEndDate.setHours(endH, endM, 0, 0);

  const diffMinutes = Math.floor(
    (outDate.getTime() - workEndDate.getTime()) / 60000
  );

  return diffMinutes > 0 ? diffMinutes : 0;
}

export function calcWorkedMinutes(checkInAt, checkOutAt) {
  const inDate = toJSDate(checkInAt);
  const outDate = toJSDate(checkOutAt);

  if (!inDate || !outDate) return 0;

  return Math.max(
    0,
    Math.floor((outDate.getTime() - inDate.getTime()) / 60000)
  );
}
