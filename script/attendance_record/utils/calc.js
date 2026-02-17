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

  const checkInTime = checkInDate.toLocaleTimeString("en-GB", {
    hour12: false,
    timeZone: "Asia/Bangkok",
  });

  const [ciH, ciM] = checkInTime.split(":").map(Number);
  const [startH, startM] = workStartStr.split(":").map(Number);

  const checkInMinutes = ciH * 60 + ciM;
  const workStartMinutes = startH * 60 + startM;

  if (checkInMinutes <= workStartMinutes) return 0;

  return checkInMinutes - workStartMinutes;
}


export function calcEarlyMinutes(checkOutDate, workEndStr) {
  if (!checkOutDate || !workEndStr) return 0;

  const checkOutTime = checkOutDate.toLocaleTimeString("en-GB", {
    hour12: false,
    timeZone: "Asia/Bangkok",
  });

  const [coH, coM] = checkOutTime.split(":").map(Number);
  const [endH, endM] = workEndStr.split(":").map(Number);

  const checkOutMinutes = coH * 60 + coM;
  const workEndMinutes = endH * 60 + endM;

  if (checkOutMinutes > workEndMinutes) {
    return checkOutMinutes - workEndMinutes;
  }

  return 0;
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
