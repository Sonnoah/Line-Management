import { getCurrentPayrollPeriod } from "@/script/attendance_record/get_current_payroll_period";
import { getCheckinsForCurrentPeriod } from "@/script/attendance_record/get_checkins_current";
import { getAllUsers } from "@/lib/get_all_users";
import { mapUsersToDailyRow } from "@/script/attendance_record/utils/map_users_to_daily_row";
import AdminAttendanceTable from "@/app/components/pages/table";
import { formatThaiDate } from "@/script/attendance_record/utils/format_thai_date";
import { getDateRangeList } from "@/script/get_date_range_list";
import { getPayrollConfig } from "@/lib/get_payroll_config";
import { getEffectivePayrollPeriod } from "@/script/attendance_record/payroll_period_service";


export default async function Page() {
  const config = await getPayrollConfig(); 
  const period = getEffectivePayrollPeriod(
    "10to25",
    config.active10to25
  );

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
      <div className="wrap">
        <AdminAttendanceTable rows={rows} />
      </div>
    </>
  );
}
