"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo} from "react";
import AdminAttendanceTable from "@/app/components/pages/table";
import AdminEditModal from "@/app/components/pages/admin_edit_modal";
import SummaryTable from "./summary_table";
import { buildSummary } from "@/script/attendance_record/utils/build_summary";
import { exportAttendanceToExcel } from "../export_excel";

export default function PeriodSwitcher({
  rows,
  label
}) {
  
  const [selectedRow, setSelectedRow] = useState(null);
  const [viewMode, setViewMode] = useState("daily"); 

  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode") || "10to25";
  const now = new Date();
  const selectedMonth =
    searchParams.get("month") ||
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const handleMonthChange = (value) => {
    router.push(`?mode=${mode}&month=${value}`);
  };

  const handleModeChange = (newMode) => {
    router.push(`?mode=${newMode}&month=${selectedMonth}`);
  };

  const summaryData = useMemo(() => {
    return buildSummary(rows, label);
  }, [rows, label]);


  return (
    <div className="">
      <main className="table-container">

        <div className="flex flex-wrap gap-2 mb-4 items-center-4">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => handleMonthChange(e.target.value)}
            className="cally-p opover1 input input-bordered"
          />

          <button
            onClick={() => handleModeChange("10to25")}
            className={`btn ${mode === "10to25" ? "btn-soft btn-primary" : "opacity-30"}`}
          >
            10–25
          </button>

          <button
            onClick={() => handleModeChange("26to09")}
            className={`btn ${mode === "26to09" ? "btn-soft btn-primary" : "opacity-30"}`}
          >
            26–09
          </button>

          <form className="filter">
            <input className={`btn ${viewMode === "daily" ? "btn-soft btn-info" : "opacity-30"}`}  
              type="radio" aria-label="Daily"
              onClick={() => setViewMode("daily")}
             />
            <input className={`btn ${viewMode === "summary" ? "btn-soft btn-info" : "opacity-30"}`} 
              type="radio" aria-label="Summary"
              onClick={() => setViewMode("summary")}
            />
            <input className="btn btn-soft btn-info" type="reset" value="×"
              onClick={() => setViewMode("daily")}
            />
          </form>

          <button
            className="btn btn-soft btn-success"
            onClick={() => exportAttendanceToExcel(rows, label)}
          >
            <span className="solar--export-outline"></span> Export Excel
          </button>
        </div>

        <h2 className="text-[18px] font-bold mb-4">{label}</h2>

        {viewMode === "daily" ? (
          <>
            <AdminAttendanceTable
              rows={rows}
              onEdit={(row) => setSelectedRow(row)}
            />

            {selectedRow && (
              <AdminEditModal
                row={selectedRow}
                onClose={() => setSelectedRow(null)}
              />
            )}
          </>
        ) : (
          <SummaryTable summary={summaryData} />
        )}

      </main>
    </div>
  );
}
