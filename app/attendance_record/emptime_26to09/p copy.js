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

export default async function Page({ searchParams }) {
  const mode = searchParams?.mode || "10to25";
  const selectedMonth =
    searchParams?.month || new Date().toISOString().slice(0, 7);

  const [year, month] = selectedMonth.split("-").map(Number);

  const baseDate = selectedMonth
    ? new Date(selectedMonth + "-01")
    : new Date();

  let startDate, endDate;

  if (mode === "10to25") {
    startDate = new Date(year, month - 1, 10);
    endDate = new Date(year, month - 1, 25);
  } else {
    startDate = new Date(year, month - 1, 26);
    endDate = new Date(year, month, 9);
  }

  const period = getPayrollPeriodByMonth(mode, baseDate);

  const [users, checkins, leaves] = await Promise.all([
  getAllUsers(),
  getCheckinsForCurrentPeriod(period),
  getApprovedRequests(),
]);

  const dates = getDateRangeList(period.startDate, period.endDate);
  const baseRows = mapUsersToDailyRow(users, checkins, dates, leaves);
  const rows = applyOtAccum(baseRows);


console.log("PERIOD10:", period10.startDate, period10.endDate);
console.log("PERIOD26:", period26.startDate, period26.endDate);

console.log("DATES10:", dates10);
console.log("DATES26:", dates26);

console.log("CHECKINS10:", checkins10.length);
console.log("CHECKINS26:", checkins26.length);



 return (
  <PeriodSwitcher
    rows={rows}
    mode={mode}
    selectedMonth={selectedMonth || new Date().toISOString().slice(0,7)}
  />
  );
}

