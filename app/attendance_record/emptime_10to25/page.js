import { getAllUsers } from "@/lib/get_all_users";
import { mapUsersToDailyRow } from "@/script/attendance_record/utils/map_users_to_daily_row";
import { formatThaiDate, applyOtAccum } from "@/script/attendance_record/utils/format_thai_date";
import { getDateRangeList } from "@/script/get_date_range_list";
import { getPayrollConfig } from "@/lib/get_payroll_config";
import { getEffectivePayrollPeriod } from "@/script/attendance_record/payroll_period_service";
import { getCheckinsForCurrentPeriod } from "@/script/attendance_record/get_checkins_current";
import { getApprovedRequests } from "@/script/attendance_record/utils/get_approved_leaves";
import PeriodSwitcher from "../PeriodSwitcher";

export default async function Page() {
  const users = await getAllUsers();
  const config = await getPayrollConfig();

  const period10 = getEffectivePayrollPeriod(
    "10to25",
    config.active10to25
  );

  const period26 = getEffectivePayrollPeriod(
    "26to09",
    config.active26to09
  );

  const [checkins10, checkins26, leaves] = await Promise.all([
    getCheckinsForCurrentPeriod(period10),
    getCheckinsForCurrentPeriod(period26),
    getApprovedRequests(),
  ]);

  const dates10 = getDateRangeList(period10.startDate, period10.endDate);
  const dates26 = getDateRangeList(period26.startDate, period26.endDate);

  const rows10 = applyOtAccum(
    mapUsersToDailyRow(users, checkins10, dates10, leaves)
  );

  const rows26 = applyOtAccum(
    mapUsersToDailyRow(users, checkins26, dates26, leaves)
  );

  console.log("PERIOD10:", period10.startDate, period10.endDate);
  console.log("PERIOD26:", period26.startDate, period26.endDate);

  console.log("DATES10:", dates10);
  console.log("DATES26:", dates26);

  console.log("CHECKINS10:", checkins10.length);
  console.log("CHECKINS26:", checkins26.length);
  

  return (
    <PeriodSwitcher
      rows10to25={rows10}
      rows26to09={rows26}
      label10to25={`รอบ ${formatThaiDate(period10.startDate)} – ${formatThaiDate(period10.endDate)}`}
      label26to09={`รอบ ${formatThaiDate(period26.startDate)} – ${formatThaiDate(period26.endDate)}`}
    />
  );
}


