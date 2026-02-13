import { NextResponse } from "next/server";
import { getAllUsers } from "@/lib/get_all_users";
import { getCheckinsByPeriod } from "@/script/attendance_record/get_checkins_current";
import { getApprovedRequests } from "@/script/attendance_record/utils/get_approved_leaves";
import { mapUsersToDailyRow } from "@/script/attendance_record/utils/map_users_to_daily_row";
import { applyOtAccum } from "@/script/attendance_record/utils/format_thai_date";
import { getDateRangeList } from "@/script/get_date_range_list";
import { getPayrollPeriodByMonth } from "@/script/attendance_record/payroll_period_by_month";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode");
  const offset = Number(searchParams.get("offset") || 0);

  const baseDate = new Date();
  baseDate.setMonth(baseDate.getMonth() + offset);

  const period = getPayrollPeriodByMonth(mode, baseDate);

  const [users, checkins, leaves] = await Promise.all([
    getAllUsers(),
    getCheckinsByPeriod(period),
    getApprovedRequests(),
  ]);

  const dates = getDateRangeList(period.startDate, period.endDate);

  const rows = applyOtAccum(
    mapUsersToDailyRow(users, checkins, dates, leaves)
  );

  return NextResponse.json({
    rows,
    label: `${period.startDate.toLocaleDateString()} - ${period.endDate.toLocaleDateString()}`
  });
}
