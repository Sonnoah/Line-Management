"use client";

import {   
  formatThaiDate,
  parseLocalDate, 
} from "@/script/attendance_record/utils/format_thai_date";
import { getRowClass } from "@/script/attendance_record/utils/format_thai_date";

export default function AdminAttendanceExcelTable({ rows, onEdit}) {
  return (
    <div className="overflow-x-auto rounded-box ">
      <table className="table table-sm ">
        <thead className="text-[14px]">
          <tr>
            <th className="text-center">No</th>
            <th className="text-center">Name</th>
            <th className="text-center">Date</th>
            <th className="text-center">Scheduled In</th>
            <th className="text-center">Scheduled Out</th>
            <th className="text-center">Check In</th>
            <th className="text-center">Check Out</th>
            <th className="text-center">Late</th>
            <th className="text-center">Excess Time</th>
            <th className="text-center">Total</th>
            <th className="text-center">Leave</th>
            <th className="text-center">OT</th>
            <th className="text-center">Accrued OT</th>
            <th className="text-center">Status</th>
            <th className="text-center">Remark</th>
            <th className="text-center"></th>
            
          </tr>
        </thead>

        <tbody>
          {rows.map((r, idx) => (
            <tr
              key={idx}
              className={`${getRowClass(r)} hover:bg-base-300`}
            >
              <th className="text-center">{r.no}</th>
              <td className="text-center whitespace-nowrap">{r.name}</td>

              <td className="text-center">
                {formatThaiDate(parseLocalDate(r.date))}
              </td>

              <td className="text-center">{r.workStart}</td>
              <td className="text-center">{r.workEnd}</td>

              <td className="text-center">{r.checkIn || "-"}</td>
              <td className="text-center">{r.checkOut || "-"}</td>

              <td className="text-center">
                {r.late > 0 ? (
                  <span>
                    {r.late}
                  </span>
                ) : "-"}
              </td>
              
              <td className="text-center">
                {r.early > 0 ? (
                  <span>
                    {r.early}
                  </span>
                ) : "-"}
              </td>

              <td className="text-center">
                {r.total === null ? (
                  "-"
                ) : r.total < 0 ? (
                  <span>
                    {r.total}
                  </span>
                ) : r.total > 0 ? (
                  <span>
                    {r.total}
                  </span>
                ) : (
                  "-"
                )}
              </td>

             <td className="text-center">
              {r.leave ? (
                <span className="badge bg-info/20 text-info-content badge-sm">
                  {r.leaveType || "Leave"}
                </span>
              ) : (
                "-"
              )}
            </td>

              <td className="text-center">
                {typeof r.ot === "number" ? r.ot : "-"}
              </td>

              <td className="text-center">
                {typeof r.otAccum === "number" ? r.otAccum : "-"}
              </td>

              <td className="text-center">
                {r.workedOnHoliday ? (
                  <span className="badge bg-warning/20 text-warning-content badge-sm">
                    Weekend Work
                  </span>
                ) : r.isHoliday ? (
                  <span className="badge bg-success/20 text-success-content badge-sm">
                    Day Off
                  </span>
                ) : r.status === "ABSENT" ? (
                  <span className="badge bg-error/20 text-error-content badge-sm">
                    Absent
                  </span>
                ) : null}
              </td>

              <td className="text-center">
                {r.remark || "-"}
              </td>

              <td className="text-center">
                <button
                  onClick={() => onEdit(r)}
                  className="btn btn-xs btn-ghost"
                >
                  <span className="solar--menu-dots-bold"></span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}