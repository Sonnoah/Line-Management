"use client";

import { saveToFirestore } from "@/lib/savedata";

export default function Request_For_Leave() {

  return (
    <div className="wrap">
      <main className="from-container">
        <h2 className="uppercase">Request For Leave</h2>
        <div className="input-container ">
          
          <form id="Form" className="form">
            <label className="label_title">Full Name</label>
            <label className="input w-full">
              <span className="solar--user-linear"></span>
              <input type="text" name="name" id="name" placeholder="ํYour Name" required />
            </label>

            <label className="label_title">Types of Leave</label>
            <select className="select w-full" defaultValue="" name="type" id="type" required>
              <option value="" disabled>Select</option>
              <option value="SickLeave">Sick Leave</option>
              <option value="PersonalLeave">Personal Leave</option>
              <option value="SwapLeaveDate">Swap Leave Date</option>
            </select>

            <label className="label_title">Start Date</label>
            <input type="date" className="input w-full" name="start_date" id="start_date" required/>

            <label className="label_title">End Date</label>
            <input type="date" className="input w-full" name="end_date" id="end_date" required />
          
            <label className="label_title">Total Days</label>
            <label className="input w-full">
              <span className="hugeicons--date-time"></span>
              <input type="number" placeholder="Enter number of days" name="total_day" id="total_day" min="1" required />
            </label>

            <label className="label_title ">Remarks</label>
            <textarea name="note" id="note" className="textarea w-full" placeholder="Optional"></textarea>
          </form>

            <button className="btn btn-soft btn-accent w-full mt-8 text-[16px]" onClick={saveToFirestore}> Submit </button>
        </div>
      </main>
    </div>
  );
}
