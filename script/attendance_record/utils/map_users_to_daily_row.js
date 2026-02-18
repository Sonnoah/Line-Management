import { isHolidayByDepartment } from "../utils/is_holiday_by_department";
import { calcLateMinutes, calcEarlyMinutes, calcWorkedMinutes, } from "./calc";
import { getWorkTime } from "./get_work_time";
import { getLeaveOnDate } from "./get_leave_on_date";
import { dateToYMD, toJSDate } from "./format_thai_date";

export function mapUsersToDailyRow(users, checkins, dates, leaves = [], companyHolidays = []) {
  const rows = [];
  let no = 1;

  const todayYMD = dateToYMD();
  const now = new Date();

  users.forEach(user => {
    const userNo = no++;
    const workTime = getWorkTime(user.department);

    dates.forEach(date => {

      const isToday = date === todayYMD;
      const isFutureDate = date > todayYMD;

      const [endH, endM] = workTime.end.split(":").map(Number);
      const workEndToday = new Date();
      workEndToday.setHours(endH, endM, 0, 0);

      const isBeforeEnd = isToday && now < workEndToday;

      const ci = checkins.find(
        c => c.userId === user.userId && c.date === date
      );

      const leave = getLeaveOnDate(leaves, user.userId, date);
      const isLeave = !!leave;

     const companyHoliday = companyHolidays.find(
      h => h.date === date
    );

    const isCompanyHoliday = !!companyHoliday;
    const isHoliday =
      isCompanyHoliday || isHolidayByDepartment(date, user.department);

    const hasCheckin = !!ci;
    const workedOnHoliday = isHoliday && hasCheckin;


    const checkInDate = ci?.checkInAt
    const checkOutDate = ci?.checkOutAt
;
  
    let holidayWorkedMinutes = 0;

    if (workedOnHoliday && ci?.checkInAt && ci?.checkOutAt) {
      holidayWorkedMinutes = calcWorkedMinutes(
        ci.checkInAt,
        ci.checkOutAt
      );
    }

    // LATE //
    let lateMinutes = 0;

    if (!isHoliday && !isLeave && ci?.checkInAt) {
      lateMinutes = calcLateMinutes(
        toJSDate(ci.checkInAt),
        workTime.start
      );
    }

    // EARLY //
    let earlyMinutes = 0;

    if (!isHoliday && !isLeave && ci?.checkOutAt && ci?.checkInAt) {

      const checkInDate = toJSDate(ci.checkInAt);
      const checkOutDate = toJSDate(ci.checkOutAt);

      // สร้างเวลาเลิกงานตาม schedule โดยอิงจากวันที่ checkIn
      const [endH, endM] = workTime.end.split(":").map(Number);

      const scheduledEnd = new Date(checkInDate);
      scheduledEnd.setHours(endH, endM, 0, 0);

      // ถ้าเลิกงานข้ามวัน และเวลาเลิกน้อยกว่าเวลาเข้า
      if (checkOutDate < scheduledEnd) {
        scheduledEnd.setDate(scheduledEnd.getDate() - 1);
      }

      const diff = Math.floor((checkOutDate - scheduledEnd) / 60000);

      earlyMinutes = diff > 0 ? diff : 0;
    }


    // OT //
    const requiredMinutes = workTime.requiredMinutes;

    let totalMinutes;
    let status = "";
    let remark = "";

    if (isFutureDate) {
      totalMinutes = null;
      status = "PENDING";
    }

    else if (isBeforeEnd && !ci) {
      totalMinutes = null;
      status = "PENDING";
    }

    else if (isLeave || isHoliday) {
      totalMinutes = 0;
      status = isLeave ? "LEAVE" : "HOLIDAY";
    }

    else if (!ci) {
      totalMinutes = -requiredMinutes;
      status = "ABSENT";
    }

    else {
      totalMinutes = (earlyMinutes || 0) - (lateMinutes || 0);
      status = ci.status;
    }

    rows.push({
      id: ci?.id || null, 
      no: userNo,
      userId: user.userId,
      name: user.username || user.displayName,
      department: user.department,
      date,

      workStart: workTime.start,
      workEnd: workTime.end,

    checkIn: ci?.checkInAt
      ? toJSDate(ci.checkInAt)?.toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Bangkok"
        })
      : "",

    checkOut: ci?.checkOutAt
      ? toJSDate(ci.checkOutAt)?.toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Bangkok"
        })
      : "",

      late: lateMinutes,
      early: earlyMinutes,
      total : totalMinutes || "-",

      holidayWorkedMinutes: holidayWorkedMinutes || 0,

      status,
      isHoliday,
      workedOnHoliday,
      isCompanyHoliday,
      leave: isLeave,
      leaveType: leave?.type || null,
      leaveNote: leave?.note || "",

      remark: isCompanyHoliday && workedOnHoliday
        ? `${Math.floor(holidayWorkedMinutes / 60)} hr | ${holidayWorkedMinutes} min`
        : isCompanyHoliday
        ? companyHoliday?.title || "Holiday"
        : isLeave
        ? leave?.note || ""
        : workedOnHoliday
        ? `${Math.floor(holidayWorkedMinutes / 60)} hr | ${holidayWorkedMinutes} min`
        : remark || "",

    });
  });
});



return rows;
}
