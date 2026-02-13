import { getCurrentPayrollPeriod } from "@/script/attendance_record/get_current_payroll_period";
import { getCheckinsForCurrentPeriod } from "@/script/attendance_record/get_checkins_current";
import { getAllUsers } from "@/lib/get_all_users";
import { mapUsersToDailyRow } from "@/script/attendance_record/utils/map_users_to_daily_row";
import AdminAttendanceTable from "@/app/components/pages/table";
import { formatThaiDate, applyOtAccum } from "@/script/attendance_record/utils/format_thai_date";
import { getDateRangeList } from "@/script/get_date_range_list";
import { getPayrollConfig } from "@/lib/get_payroll_config";
import { getEffectivePayrollPeriod } from "@/script/attendance_record/payroll_period_service";
import { getApprovedRequests } from "@/script/attendance_record/utils/get_approved_leaves";


export default async function Page() {

  const config = await getPayrollConfig(); 
   const period = getEffectivePayrollPeriod(
    "26to09",
    config.active26to09
  );

  const [users, checkins, leaves] = await Promise.all([
    getAllUsers(),
    getCheckinsForCurrentPeriod(period),
    getApprovedRequests(), 
  ]);

  const dates = getDateRangeList(period.startDate, period.endDate);
  const baseRows = mapUsersToDailyRow(users, checkins, dates, leaves);
  const rows = applyOtAccum(baseRows);

  return (
    <>
      <div className="wrap">
      <main className="table-container">
      <h2 className="text-xl font-bold mb-4">
        📅 รอบเงินเดือน:{" "}
        {formatThaiDate(period.startDate)} –{" "}
        {formatThaiDate(period.endDate)}
      </h2>
        ฉ
        </main>
      </div>
    </>
  );
}ฤ