"use client";

import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase_config";
import Swal from "sweetalert2";


export default function AddHolidayModal({ holiday, onClose  }) {
  const [date, setDate] = useState(holiday?.date || "");
  const [title, setTitle] = useState(holiday?.title || "");

  const handleSave = async () => {
    if (!date || !title) {
        Swal.fire({
        icon: "warning",
        title: "Select date",
        text: "Please select a date",
        timer: 5000,
        showConfirmButton: false,
        });
    return;
  }
    if (holiday) {
      await updateDoc(doc(db, "CompanyHolidays", holiday.id), {
        date,
        title
      });
    } else {
      await addDoc(collection(db, "CompanyHolidays"), {
        date,
        title
      });
    }

    await addDoc(collection(db, "CompanyHolidays"), {
      date,
      title: title ,
      createdAt: Timestamp.now(),
      createdBy: "admin"
    });
        Swal.fire({
        icon: "success",
        title: "Success",
        text: "Holiday record updated.",
        timer: 3000,
        showConfirmButton: false,
        willClose: () => {
            window.location.reload();
        },
     });
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Add Holidays</h3>

        <label>วันที่</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input w-full border-[#243c5a]/10 outline-accent text-[16px] mb-3 mt-1"
        />

        <label>ชื่อวันหยุด</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input w-full border-[#243c5a]/10 outline-accent text-[16px] mb-3 mt-1"
        />

        <div className="flex justify-end gap-2">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-soft btn-accent" onClick={handleSave}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
