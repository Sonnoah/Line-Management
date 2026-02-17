"use client";

import { useState } from "react";
import { doc, updateDoc, collection, addDoc, Timestamp } from "firebase/firestore";
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
      timer: 3000,
      showConfirmButton: false,
    });
    return;
  }

  try {
    if (holiday) {
      // ✅ UPDATE
      await updateDoc(doc(db, "CompanyHolidays", holiday.id), {
        date,
        title,
        updatedAt: Timestamp.now()
      });
    } else {
      // ✅ CREATE
      await addDoc(collection(db, "CompanyHolidays"), {
        date,
        title,
        createdAt: Timestamp.now(),
        createdBy: "Admin"
      });
    }

    Swal.fire({
      icon: "success",
      title: "Success",
      text: holiday ? "Holiday Updated" : "Holiday Added",
      timer: 2000,
      showConfirmButton: false,
      willClose: () => {
        window.location.reload();
      }
    });

  } catch (error) {
    console.error(error);
  }
};


  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-[16px] mb-4">
          {holiday ? " Update" : "Add"}</h3>

        <label className="text-[14px]">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input w-full border-[#243c5a]/10 outline-accent text-[14px] mb-3 mt-1"
        />

        <label className="text-[14px]">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input w-full border-[#243c5a]/10 outline-accent text-[14px] mb-3 mt-1"
        />

        <div className="flex justify-end gap-2">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
            <button className="btn btn-soft btn-accent" onClick={handleSave}>
              {holiday ? "Update" : "Add"}
            </button>
        </div>
      </div>
    </div>
  );
}
