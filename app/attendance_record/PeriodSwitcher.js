"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminAttendanceTable from "@/app/components/pages/table";

export default function PeriodSwitcher({
  rows10to25,
  rows26to09,
  label10to25,
  label26to09,
  selectedMonth
}) {
  const [mode, setMode] = useState("10to25");

  const rows = useMemo(() => {
    return mode === "10to25" ? rows10to25 : rows26to09;
  }, [mode, rows10to25, rows26to09]);

  const router = useRouter();

  const handleMonthChange = (value) => {
    router.push(
      `?mode=${mode}&month=${value}`
    );
  };

  const handleModeChange = (newMode) => {
    router.push(
      `?mode=${newMode}&month=${selectedMonth}`
    );
  };

  return (
    <>
      <div className="wrap">
        <main className="table-container">
          <div className="flex gap-2 mb-4">

            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="input input-bordered"
            />

            <button
              onClick={() => setMode("10to25")}
              className={`btn ${mode === "10to25" ? "btn-primary" : "btn-outline"}`}
            >
              10–25
            </button>

            <button
              onClick={() => setMode("26to09")}
              className={`btn ${mode === "26to09" ? "btn-primary" : "btn-outline"}`}
            >
              26–9
            </button>
          </div>

          <AdminAttendanceTable rows={rows ?? []} />
        </main>
      </div>
    </>
  );
}
