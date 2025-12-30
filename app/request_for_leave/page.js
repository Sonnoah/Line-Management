"use client";

import { saveToFirestore } from "@/lib/savedata";
import { useState } from "react";

export default function Request_For_Leave() {

const initialForm = {
  name: "",
  type: "",
  start_date: "",
  end_date: "",
  total_day: "",
  note: "",
};

const [formData, setFormData] = useState(initialForm);

const handleSubmit = async () => {
  const success = await saveToFirestore(formData);
  if (success) {
    setFormData(initialForm);
  }
};

  const isFormValid =
    formData.name &&
    formData.type &&
    formData.start_date &&
    formData.end_date &&
    formData.total_day;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="wrap">
      <main className="from-container">
        <h2 className="uppercase">Request For Leave</h2>

        <div className="input-container">
          <form id="Form" className="form">
            <label className="label_title">Full Name</label>
            <label className="input w-full">

              <span className="solar--user-linear"></span>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
              />
            </label>

            <label className="label_title">Types of Leave</label>
            <select
              className="select w-full"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="" disabled hidden>Select</option>
              <option value="SickLeave">Sick Leave</option>
              <option value="PersonalLeave">Personal Leave</option>
              <option value="SwapLeaveDate">Swap Leave Date</option>
            </select>

            <label className="label_title">Start Date</label>
            <input
              type="date"
              className="input w-full"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
            />

            <label className="label_title">End Date</label>
            <input
              type="date"
              className="input w-full"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
            />

            <label className="label_title">Total Days</label>
            <label className="input w-full">
              <span className="hugeicons--date-time"></span>
              <input
                type="number"
                name="total_day"
                min="1"
                placeholder="Enter number of days"
                value={formData.total_day}
                onChange={handleChange}
              />
            </label>

            <label className="label_title">Remarks</label>
            <textarea
              name="note"
              className="textarea w-full"
              placeholder="Optional"
              value={formData.note}
              onChange={handleChange}
            />
          </form>

          <button
            className="btn btn-soft btn-accent w-full mt-8"
            disabled={!isFormValid}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </main>
    </div>
  );
}
