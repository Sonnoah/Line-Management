export function timeStrToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

export function calcLateMinutes(checkInAt, workStart) {
  if (!checkInAt) return null;

  const checkInDate = new Date(checkInAt.seconds * 1000);

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
  if (!checkOutAt) return 0;

  const outDate = new Date(checkOutAt.seconds * 1000);
  const outMinutes = outDate.getHours() * 60 + outDate.getMinutes();

  const workEndMinutes = timeStrToMinutes(workEnd);

  const overtime = outMinutes - workEndMinutes;

  return overtime > 0 ? overtime : 0;
}


export function calcWorkedMinutes(checkInAt, checkOutAt) {
  if (!checkInAt || !checkOutAt) return 0;

  const inMs = checkInAt.seconds * 1000;
  const outMs = checkOutAt.seconds * 1000;

  return Math.max(0, Math.floor((outMs - inMs) / 60000));
}
