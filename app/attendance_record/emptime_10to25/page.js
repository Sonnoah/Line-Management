import { getCurrentPayrollPeriod } from "@/script/attendance_record/get_current_payroll_period";
import { getCheckinsForCurrentPeriod } from "@/script/attendance_record/get_checkins_current";
import { getAllUsers } from "@/lib/get_all_users";
import { mapUsersToDailyRow } from "@/script/attendance_record/utils/map_users_to_daily_row";
import AdminAttendanceTable from "@/app/components/pages/table";
import { formatThaiDate } from "@/script/attendance_record/utils/format_thai_date";
import { getDateRangeList } from "@/script/get_date_range_list";

export default async function Page() {
  const period = getCurrentPayrollPeriod(1);

  const users = await getAllUsers();
  const checkins = await getCheckinsForCurrentPeriod(period);

  const dates = getDateRangeList(period.startDate, period.endDate);
  const rows = mapUsersToDailyRow(users, checkins, dates);

  return (
    <>
      <h2 className="text-xl font-bold mb-4">
        📅 รอบเงินเดือน {period.round}:{" "}
        {formatThaiDate(period.startDate)} –{" "}
        {formatThaiDate(period.endDate)}
      </h2>

      <AdminAttendanceTable rows={rows} />
    </>
  );
}
