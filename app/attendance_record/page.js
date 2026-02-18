import { getCheckinsForCurrentPeriod } from "@/script/attendance_record/get_checkins_current";
import { getAllUsers } from "@/lib/get_all_users";
import { mapUsersToDailyRow } from "@/script/attendance_record/utils/map_users_to_daily_row";
import { formatThaiDate} from "@/script/attendance_record/utils/format_thai_date";
import { applyOtAccum } from "@/script/attendance_record/utils/calc";
import { getDateRangeList } from "@/script/get_date_range_list";
import { getApprovedRequests } from "@/script/attendance_record/utils/get_approved_leaves";
import { getCompanyHolidays } from "@/script/attendance_record/utils/get_company_holidays";
import PeriodSwitcher from "../components/pages/period_switcher";
import AdminGuard from "@/app/components/admin_guard";

export default async function Page({ searchParams }) {

  const mode = searchParams?.mode || "10to25";

  const now = new Date();
  const selectedMonth =
    searchParams?.month ||
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [year, month] = selectedMonth.split("-").map(Number);
  
  let startDate, endDate;

  if (mode === "10to25") {
    startDate = new Date(year, month - 1, 10);
    endDate = new Date(year, month - 1, 25);
  } else {
    startDate = new Date(year, month - 1, 26);
    endDate = new Date(year, month, 9);
  }

  const label = `${formatThaiDate(startDate)} – ${formatThaiDate(endDate)}`;

  const period = {
    startDate,
    endDate,
    round: mode === "10to25" ? "10–25" : "26–9"
  };

  const [users, checkins, leaves, companyHolidays] = await Promise.all([
    getAllUsers(),
    getCheckinsForCurrentPeriod(period),
    getApprovedRequests(),
    getCompanyHolidays(),  
  ]);

  const dates = getDateRangeList(period.startDate, period.endDate);
  const baseRows = mapUsersToDailyRow(users, checkins, dates, leaves, companyHolidays);
  const rows = applyOtAccum(baseRows);

  return (
    <AdminGuard>
      <PeriodSwitcher
        rows={rows}
        label={label}
        mode={mode}
        selectedMonth={selectedMonth}
      />
    </AdminGuard>
  );
}

