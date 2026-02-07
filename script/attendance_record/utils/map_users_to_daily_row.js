import { isHolidayByDepartment } from "../utils/is_holiday_by_department";

export function mapUsersToDailyRow(users, checkins, dates) {
  const rows = [];
  let no = 1;

  users.forEach(user => {

    const userNo = no++;

    dates.forEach(date => {
      const ci = checkins.find(
        c => c.userId === user.userId && c.date === date
      );

      const isHoliday = isHolidayByDepartment(date, user.department);

      rows.push({
        no: userNo,
        userId: user.userId,
        name: user.name,
        department: user.department,
        date,

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
          isHoliday ? "0.0" : ci ? (ci.missingMinutes / 60).toFixed(1) : "9.0",

        overtimeHours: ci ? (ci.overtimeMinutes / 60).toFixed(1) : "0.0",

        status: isHoliday ? "HOLIDAY" : ci?.status || "ABSENT",
        isHoliday,

        remark: isHoliday ? "วันหยุด" : !ci ? "ขาด" : "",
      });
    });
  });

  return rows;
}

