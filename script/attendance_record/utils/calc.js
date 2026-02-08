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
  if (!checkInAt || !checkOutAt) return 0;

  const inDate = new Date(checkInAt.seconds * 1000);
  const outDate = new Date(checkOutAt.seconds * 1000);

  const inMinutes = inDate.getHours() * 60 + inDate.getMinutes();
  const outMinutes = outDate.getHours() * 60 + outDate.getMinutes();

  const workStartMinutes = timeStrToMinutes(workStart);
  const workEndMinutes = timeStrToMinutes(workEnd);

  const early = workStartMinutes - inMinutes;   // มาก่อน
  const lateOut = outMinutes - workEndMinutes;  // เลิกช้า

  return (early > 0 ? early : 0) + (lateOut > 0 ? lateOut : 0);
}