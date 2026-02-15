"use client";

import { useState } from "react";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase_config";
import Swal from "sweetalert2";

export default function AdminEditModal({ row, onClose }) {
  const [checkIn, setCheckIn] = useState(row.checkIn || "");
  const [checkOut, setCheckOut] = useState(row.checkOut || "");
  const [adminremark, setAdminRemark] = useState(row.remark || "");

    const handleSave = async () => {
    if (!row.id) {
            Swal.fire({
              icon: "warning",
              title: "Not Found",
              text: "No results matching this Document ID",
              timer: 5000,
              showConfirmButton: false,
            });
        return;
    }

    const ref = doc(db, "Checkins", row.id);

    const [inH, inM] = checkIn.split(":").map(Number);
    const [outH, outM] = checkOut.split(":").map(Number);

    const baseDate = new Date(row.date);

    const newCheckIn = new Date(baseDate);
    newCheckIn.setHours(inH, inM, 0, 0);

    const newCheckOut = new Date(baseDate);
    newCheckOut.setHours(outH, outM, 0, 0);

    await updateDoc(ref, {
        checkInAt: Timestamp.fromDate(newCheckIn),
        checkOutAt: Timestamp.fromDate(newCheckOut),
        adminremark,
        adminEdited: true,
        updatedAt: Timestamp.now()
        });
            Swal.fire({
            icon: "success",
            title: "Success",
            text: "Document ID has been updated",
            timer: 1500,
            showConfirmButton: false,
            willClose: () => {
                window.location.reload();
            },
        });
    }

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">แก้ไขเวลา</h3>

        <label>เวลาเข้า</label>
        <input
          type="time"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="input w-full border-[#243c5a]/10 outline-accent text-[16px] mb-3 mt-1"
        />

        <label>เวลาออก</label>
        <input
          type="time"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="input w-full border-[#243c5a]/10 outline-accent text-[16px] mb-3 mt-1"
        />

        <label>หมายเหตุ</label>
        <input
          type="text"
          value={adminremark}
          onChange={(e) => setAdminRemark(e.target.value)}
          className="input w-full border-[#243c5a]/10 outline-accent text-[16px] mb-3 mt-1"
        />

        <div className="flex justify-end gap-2">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-soft btn-accent" onClick={handleSave}>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
