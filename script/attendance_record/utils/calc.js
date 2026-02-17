function toJSDate(value) {
  if (!value) return null;

  // Firestore Timestamp
  if (typeof value.toDate === "function") {
    return value.toDate();
  }

  // Plain object { seconds }
  if (value.seconds) {
    return new Date(value.seconds * 1000);
  }

  // Already Date
  if (value instanceof Date) {
    return value;
  }

  return null;
}

export function timeStrToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

export function calcLateMinutes(checkInAt, workStart) {
  const inDate = toJSDate(checkInAt);
  if (!inDate) return 0;

  const workStartDate = new Date(inDate);

  const [startH, startM] = workStart.split(":").map(Number);
  workStartDate.setHours(startH, startM, 0, 0);

  const diffMinutes = Math.floor(
    (inDate.getTime() - workStartDate.getTime()) / 60000
  );

  return diffMinutes > 0 ? diffMinutes : 0;
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
