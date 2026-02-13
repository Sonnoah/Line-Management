"use client";

import {   
  formatThaiDate,
  parseLocalDate, 
} from "@/script/attendance_record/utils/format_thai_date";
import { getRowClass } from "@/script/attendance_record/utils/format_thai_date";

export default function AdminAttendanceExcelTable({ rows }) {
  return (
    <div className="overflow-x-auto rounded-box ">
      <table className="table table-sm ">
        <thead className="text-black text-[14px]">
          <tr>
            <th className="text-center">ลำดับ</th>
            <th>ชื่อ</th>
            <th className="text-center">วันที่</th>
            <th className="text-center">กำหนดเข้างาน</th>
            <th className="text-center">กำหนดออกงาน</th>
            <th className="text-center">เข้า</th>
            <th className="text-center">ออก</th>
            <th className="text-center">สาย</th>
            <th className="text-center">ล่วงเวลา</th>
            <th className="text-center">ผลรวม</th>
            <th className="text-center">ลา</th>
            <th className="text-center">OT</th>
            <th className="text-center">OT สะสม</th>
            <th className="text-center">วันทำงาน / วันหยุด</th>
            <th className="text-center">หมายเหตุ</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r, idx) => (
            <tr
              key={idx}
              className={`${getRowClass(r)} hover:bg-base-300`}
            >
              <th className="text-center">{r.no}</th>
              <td className="whitespace-nowrap">{r.name}</td>

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
                  "0"
                )}
              </td>


              <td className="text-center">
                {r.leave ? <span className="text-error font-bold">ลา</span> : "-"}
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
                    ทำงานวันหยุด
                  </span>
                ) : r.isHoliday ? (
                  <span className="badge bg-success/20 text-success-content badge-sm">
                    วันหยุด
                  </span>
                ) : r.status === "ABSENT" ? (
                  <span className="badge bg-error/20 text-error-content badge-sm">
                    ขาด
                  </span>
                ) : null}
              </td>

              <td className="text-center text-error font-medium">
                {r.remark || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}