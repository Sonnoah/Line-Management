import { isHolidayByDepartment } from "../utils/is_holiday_by_department";
import { calcLateMinutes, calcEarlyMinutes, calcWorkedMinutes } from "./calc";
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

   
      let holidayWorkedMinutes = 0;
      if (workedOnHoliday && ci) {
        holidayWorkedMinutes = calcWorkedMinutes(
          checkInDate,
          checkOutDate
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
      
      let totalMinutes = null;
      let status = "";
      let remark = "";

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

        status,
        isHoliday,
        workedOnHoliday,
        isCompanyHoliday,
        leave: isLeave,
        leaveType: leave?.type || null,
        leaveNote: leave?.note || "",

        remark: isCompanyHoliday && workedOnHoliday
          ? `${holidayWorkedMinutes} min`
          : isCompanyHoliday
          ? companyHoliday?.title || "Holiday"
          : isLeave
          ? leave?.note || ""
          : workedOnHoliday
          ? `${holidayWorkedMinutes} min`
          : remark || "",

      });
    });
  });

  return rows;
}
