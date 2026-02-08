import { isHolidayByDepartment } from "../utils/is_holiday_by_department";
import { calcLateMinutes, calcEarlyMinutes } from "./calc";
import { getWorkTime } from "./get_work_time";

export function mapUsersToDailyRow(users, checkins, dates) {
  const rows = [];
  let no = 1;

  users.forEach(user => {
    const userNo = no++;

    const workTime = getWorkTime(user.department);

    dates.forEach(date => {
      const ci = checkins.find(
        c => c.userId === user.userId && c.date === date
      );

      const isHoliday = isHolidayByDepartment(date, user.department);
      const hasCheckin = !!ci;
      const workedOnHoliday = isHoliday && hasCheckin;
      const lateMinutes =
        !isHoliday && ci
          ? calcLateMinutes(ci.checkInAt, workTime.start)
          : null;

      const earlyMinutes =
        !isHoliday && ci
          ? calcEarlyMinutes(
              ci.checkInAt,
              ci.checkOutAt,
              workTime.start,
              workTime.end
            )
          : 0;

      const totalMinutes =
        earlyMinutes !== null || lateMinutes !== null
          ? (earlyMinutes || 0) - (lateMinutes || 0)
          : null;

      rows.push({
        no: userNo,
        userId: user.userId,
        name: user.username || user.displayName,
        department: user.department,
        date,
        workStart: workTime.start,
        workEnd: workTime.end,

        checkIn: ci?.checkInAt
          ? new Date(ci.checkInAt.seconds * 1000).toLocaleTimeString("th-TH", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",

        checkOut: ci?.checkOutAt
          ? new Date(ci.checkOutAt.seconds * 1000).toLocaleTimeString("th-TH", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",

        workedHours: ci ? (ci.workedMinutes / 60).toFixed(1) : "0.0",

        missingHours:
          isHoliday || workedOnHoliday
            ? "0.0"
            : ci
            ? (ci.missingMinutes / 60).toFixed(1)
            : "9.0",

        overtimeHours: ci ? (ci.overtimeMinutes / 60).toFixed(1) : "0.0",

        status: workedOnHoliday
          ? "WORKED_HOLIDAY"
          : isHoliday
          ? "HOLIDAY"
          : ci?.status || "ABSENT",

        late: lateMinutes,
        early: earlyMinutes,
        total: totalMinutes,
        isHoliday,
        workedOnHoliday, 

        remark: workedOnHoliday
          ? "ทำงานวันหยุด"
          : isHoliday
          ? "วันหยุด"
          : !ci
          ? "ขาด"
          : "",
      });
    });
  });

  return rows;
}
