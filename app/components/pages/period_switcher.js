"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo} from "react";
import AdminAttendanceTable from "@/app/components/pages/table";
import AdminEditModal from "@/app/components/pages/admin_edit_modal";
import SummaryTable from "./summary_table";
import { buildSummary } from "@/app/components/pages/build_summary";
import { exportAttendanceToExcel } from "../excel/export_excel";
import { useRef, useEffect } from "react";


export default function PeriodSwitcher({
  rows,
  label,
}) {
    
  const [selectedRow, setSelectedRow] = useState(null);
  const [viewMode, setViewMode] = useState("daily");
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);
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

  const toggleDepartment = (dept) => {
  setSelectedDepartments((prev) =>
    prev.includes(dept)
      ? prev.filter((d) => d !== dept)
      : [...prev, dept]
  );
};

  const filteredRows = useMemo(() => {
    if (selectedDepartments.length === 0) return rows;

    return rows.filter((r) =>
      selectedDepartments.includes(r.department)
    );
  }, [rows, selectedDepartments]);

  const summaryData = useMemo(() => {
    return buildSummary(filteredRows, label);
  }, [filteredRows, label]);


    useEffect(() => {
      function handleClickOutside(event) {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

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
            className={`btn ${mode === "10to25" ? "btn-soft btn-primary" : "opacity-50"}`}
          >
            10–25
          </button>

          <button
            onClick={() => handleModeChange("26to09")}
            className={`btn ${mode === "26to09" ? "btn-soft btn-primary" : "opacity-50"}`}
          >
            26–09
          </button>

          <form className="filter gap-1">
            <input className={`btn ${viewMode === "daily" ? "btn-soft btn-secondary" : "opacity-50"}`}  
              type="radio" aria-label="Daily"
              onClick={() => setViewMode("daily")}
             />
            <input className={`btn ${viewMode === "summary" ? "btn-soft btn-secondary" : "opacity-50"}`} 
              type="radio" aria-label="Summary"
              onClick={() => setViewMode("summary")}
            />
            <input className="btn btn-soft btn-secondary" type="reset" value="×"
              onClick={() => setViewMode("daily")}
            />
          </form>

        <div ref={dropdownRef} className="relative inline-block">
          <div className="dropdown dropdown-bottom">
             <button
                className="btn btn-soft btn-info"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen((prev) => !prev);
                  }}
              >      
            <span className="ci--filter"></span> Filter
            </button>
              {isOpen && (
                <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-max p-2 mt-2 shadow-sm">
                  <li><a className="pointer-events-none">
                    <p className="text-[14px] font-bold">Filter By Department</p></a> 
                  </li>
                    <ul className="menu menu-vertical lg:menu-horizontal ">
                      <li>
                        <input className= {`btn btn-soft mr-2 mb-2 rounded-full border-0
                          ${selectedDepartments.includes("Office")
                            ? "btn-soft btn-info "
                            : "opacity-50"
                          }`} 
                            type="checkbox" aria-label="Office"
                            checked={selectedDepartments.includes("Office")}
                            onChange={() => toggleDepartment("Office")}/>
                      </li>
                      <li>
                        <input className= {`btn btn-soft mr-1 mb-2 rounded-full border-0
                          ${selectedDepartments.includes("Production")
                            ? "btn-info "
                            : "opacity-50"
                          }`} 
                          type="checkbox" aria-label="Production"                        
                          checked={selectedDepartments.includes("Production")}
                          onChange={() => toggleDepartment("Production")}/>
                      </li>
                    </ul>
                </ul>
              )}
          </div>
        </div>
        
          <button
            className="btn btn-soft btn-success"
            onClick={() => exportAttendanceToExcel(filteredRows, label)}
          >
            <span className="solar--export-outline"></span> Export Excel
          </button>
        </div>

        <h2 className="text-[18px] font-bold mb-4">{label}</h2>

        {viewMode === "daily" ? (
          <>
            <AdminAttendanceTable
              rows={filteredRows}
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
