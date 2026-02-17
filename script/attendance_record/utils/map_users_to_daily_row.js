import { isHolidayByDepartment } from "../utils/is_holiday_by_department";
import { calcLateMinutes, calcEarlyMinutes, calcWorkedMinutes } from "./calc";
import { getWorkTime } from "./get_work_time";
import { getLeaveOnDate } from "./get_leave_on_date";
import { dateToYMD } from "./format_thai_date";

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

      // เวลาเลิกงานวันนี้
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

      // ------------------------
      // late
      // ------------------------
      const lateMinutes =
        !isHoliday && ci
          ? calcLateMinutes(ci.checkInAt, workTime.start)
          : null;

      // ------------------------
      // early / overtime
      // (ติดลบ = ออกก่อน)
      // ------------------------
      const earlyMinutes =
        !isHoliday && ci
          ? calcEarlyMinutes(
              ci.checkInAt,
              ci.checkOutAt,
              workTime.start,
              workTime.end
            )
          : null;

      const requiredMinutes = workTime.requiredMinutes;

      let totalMinutes = null;
      let status = "";
      let remark = "";

      // =========================
      // FUTURE DAY
      // =========================
      if (isFutureDate) {
        totalMinutes = null;
        status = "PENDING";
      }

      // =========================
      // TODAY but not finish work yet
      // =========================
      else if (isBeforeEnd && !ci) {
        totalMinutes = null;
        status = "PENDING";
      }

      // =========================
      // LEAVE / HOLIDAY
      // =========================
      else if (isLeave || isHoliday) {
        totalMinutes = 0;
        status = isLeave ? "LEAVE" : "HOLIDAY";
      }

      // =========================
      // ABSENT
      // =========================
      else if (!ci) {
        totalMinutes = -requiredMinutes;
        status = "ABSENT";
      }

      // =========================
      // NORMAL WORK DAY
      // =========================
      else {
        const early = earlyMinutes ?? 0;
        const late = lateMinutes ?? 0;

        totalMinutes = early - late;
        status = ci.status;
      }

      // =========================
      // HOLIDAY WORKED MINUTES
      // =========================
      let holidayWorkedMinutes = 0;
      if (workedOnHoliday && ci) {
        holidayWorkedMinutes = calcWorkedMinutes(
          ci.checkInAt,
          ci.checkOutAt
        );
      }

      // =========================
      // PUSH ROW
      // =========================
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

        // ? ci.checkInAt.toDate().toLocaleTimeString("th-TH", {
        //     hour: "2-digit",
        //     minute: "2-digit",
        //     hour12: false,
        //     timeZone: "Asia/Bangkok"
        //   })
        // : "",

        total: totalMinutes,
        late: lateMinutes,
        early: earlyMinutes,

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
