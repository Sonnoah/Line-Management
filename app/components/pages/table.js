"use client";

import {   
  formatThaiDate,
  parseLocalDate, 
} from "@/script/attendance_record/utils/format_thai_date";
import { useState } from "react";
import { getRowClass } from "@/script/attendance_record/utils/format_thai_date";
import HolidayListModal from "@/app/components/pages/holiday_list_modal";


export default function AdminAttendanceTable({ rows, onEdit}) {

  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [showAddHolidayModal, setShowAddHolidayModal] = useState(false);
  
  return (
    <div className="overflow-x-auto rounded-box ">
      <table className="table table-sm ">
        <thead className="text-[14px]">
          <tr>
            <th className="text-center">No</th>
            <th> Name</th>
            <th> Date</th>
            <th> Department</th>
            <th className="text-center">Scheduled In</th>
            <th className="text-center">Scheduled Out</th>
            <th className="text-center">Check In</th>
            <th className="text-center">Check Out</th>
            <th className="text-center">Late (Min)</th>
            <th className="text-center">Overtime (Min)</th>
            <th className="text-center">Total (Min)</th>
            <th className="text-center">Leave</th>
            <th className="text-center">OT (Min)</th>
            <th className="text-center">Accrued OT (Min)</th>
            <th className="text-center">Status</th>
            <th className="text-center">Remark</th>
            <th className="text-center">
              <button 
                type="button"
                className="btn btn-ghost btn-circle"
                onClick={() => setShowHolidayModal(true)}
              >
                <span className="streamline--calendar-add"></span>
              </button>
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r, idx) => (
            <tr
              key={idx}
              className={`${getRowClass(r)} hover:bg-base-300`}
            >
              <th className="text-center text-[14px]">{r.no}</th>
              <td className="whitespace-nowrap text-[14px]">{r.name}</td>

              <td className="text-[14px]">
                {formatThaiDate(parseLocalDate(r.date))}
              </td>

              <td className="text-center text-[14px]">{r.department || "-"}</td>

              <td className="text-center text-[14px]">{r.workStart}</td>
              <td className="text-center text-[14px]">{r.workEnd}</td>

              <td className="text-center text-[14px]">{r.checkIn || "-"}</td>
              <td className="text-center text-[14px]">{r.checkOut || "-"}</td>

              <td className="text-center text-[14px]">
                {r.late > 0 ? (
                  <span>
                    {r.late}
                  </span>
                ) : "-"}
              </td>
              
              <td className="text-center text-[14px]">
                {r.early > 0 ? (
                  <span>
                    {r.early}
                  </span>
                ) : "-"}
              </td>

              <td className="text-center text-[14px]">
                {r.total === 0 ? "-" : r.total}
              </td>

             <td className="text-center text-[14px]">
              {r.leave ? (
                <span className="badge badge-outline badge-info w-30">
                  {r.leaveType || "Leave"}
                </span>
              ) : (
                "-"
              )}
            </td>

            <td className="text-center text-[14px]">
              {r.ot === 0 ? "-" : r.ot}
            </td>

              <td className="text-center text-[14px]">
                {typeof r.otAccum === "number" ? r.otAccum : "-"}
              </td>

              <td className="text-center text-[14px] ">
                {r.isCompanyHoliday && r.workedOnHoliday ? (
                  <span className="badge badge-outline badge-warning w-30">
                    Holiday Work
                  </span>
                ) : r.workedOnHoliday ? (
                  <span className="badge badge-outline badge-warning w-30">
                    Weekend Work
                  </span>

                ) : r.isCompanyHoliday ? (  
                  <span className="badge badge-outline badge-primary w-30">
                    Holiday
                  </span>

                ) : r.isHoliday ? (
                  <span className="badge badge-outline badge-success w-30">
                    Day Off
                  </span>

                ) : r.status === "ABSENT" ? (
                  <span className="badge badge-outline badge-error w-30">
                    Absent
                  </span>

                ) : (
                "-"
                )}
              </td>


              <td className="text-center text-[14px]">
                {r.remark || "-"}
              </td>

              <td className="text-center text-[14px]">
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
        {showHolidayModal && (
          <HolidayListModal
            onClose={() => {
              setShowHolidayModal(false);
              window.location.reload();;
            }}
          />
        )}
    </div>
  );
}