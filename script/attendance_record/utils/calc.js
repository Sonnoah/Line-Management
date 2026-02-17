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
  const checkInDate = toJSDate(checkInAt);
  if (!checkInDate) return null;

  const checkInMinutes =
    checkInDate.getHours() * 60 + checkInDate.getMinutes();

  const workStartMinutes = timeStrToMinutes(workStart);

  const late = checkInMinutes - workStartMinutes;

  return late > 0 ? late : 0;
}

export function calcEarlyMinutes(
  checkInAt,
  checkOutAt,
  workStart,
  workEnd
) {
  const outDate = toJSDate(checkOutAt);
  if (!outDate) return 0;

  const outMinutes =
    outDate.getHours() * 60 + outDate.getMinutes();

  const workEndMinutes = timeStrToMinutes(workEnd);

  const overtime = outMinutes - workEndMinutes;

  return overtime > 0 ? overtime : 0;
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
