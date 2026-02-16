"use client";

import { saveToFirestore } from "@/lib/savedata";
import { useState, useEffect } from "react";
import { getLeaveQuota, calculateDays } from "@/lib/get_leave_quota";
import { get_liff_Profile } from "@/helper/liff_get_profile";
import { Loading } from "@/app/components/loading";
import { WaitLoading } from "@/app/components/wait_loading";

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
  const [quota, setQuota] = useState({ privatePay: 0, annual: 0 });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
  async function init() {
    const p = await get_liff_Profile();
    if (!p?.userId) return;

    setProfile(p);

    const year = new Date().getFullYear();
    const quotaResult = await getLeaveQuota(p.userId, year);

    setQuota(quotaResult);

    setFormData((f) => ({
      ...f,
      name: p.username || "",
    }));

    setLoading(false);
  }

    init();
  }, []);

  const isPrivatePayFull = quota.privatePay >= 4;
  const isAnnualFull = quota.annual >= 6;

  // const isQuotaExceeded =
  //   (formData.type === "Private pay" && isPrivatePayFull) ||
  //   (formData.type === "Annual" && isAnnualFull);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ วางตรงนี้
  const requestedDays = calculateDays(
    formData.start_date,
    formData.end_date
  );

  const isPrivatePayExceeded =
    formData.type === "Private pay" &&
    quota.privatePay + requestedDays > 4;

  const isAnnualExceeded =
    formData.type === "Annual" &&
    quota.annual + requestedDays > 6;

  const isQuotaExceeded = isPrivatePayExceeded || isAnnualExceeded;

  const isFormValid =
    formData.name &&
    formData.type &&
    formData.start_date &&
    formData.end_date &&
    formData.total_day &&
    !isQuotaExceeded;


    const handleSubmit = async () => {
    if (isQuotaExceeded || loading || submitting) return;

    try {
      setSubmitting(true);

      const success = await saveToFirestore({
        ...formData,
        userId: profile.userId,
      });

      if (success) {
        setFormData(initialForm);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="wrap">
      <main className="from-container">
        <h2 className="uppercase">Request For Leave</h2>

        <div className="input-container">
          <form id="Form" className="form">
            <label className="label_title">Full Name</label>
              <label className="input w-full border-[#243c5a]/10 outline-accent text-[16px]">
                <span className="solar--user-linear"></span>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
            </label>

            <label className="label_title">Types of Leave</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none
                            streamline--travel-places-beach-island-waves-outdoor-recreation-tree-beach-palm-wave-water"
                ></span>

                <select
                  className="select w-full pl-10 border-[#243c5a]/10 outline-accent text-[16px]"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="" disabled hidden>Select</option>
                  <option value="Private pay" disabled={isPrivatePayFull}>
                    Private pay {isPrivatePayFull && "(Quota Reached)"}
                  </option>
                  <option value="Private no pay">Private no pay</option>
                  <option value="Annual" disabled={isAnnualFull}>
                    Annual {isAnnualFull && "(Quota Reached)"}
                  </option>
                  <option value="Sick">Sick</option>
                  <option value="Holiday swap">Holiday swap</option>
                </select>
              </div>

            <label className="label_title">Start Date</label>
            <label className="input w-full border-[#243c5a]/10 outline-accent text-[16px]">
              <span class="solar--calendar-outline"></span>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
              />
            </label>

            <label className="label_title">End Date</label>
            <label className="input w-full border-[#243c5a]/10 outline-accent text-[16px]">
              <span class="solar--calendar-outline"></span>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
              />
            </label>

            <label className="label_title">Total Days</label>
            <label className="input w-full border-[#243c5a]/10 outline-accent text-[16px]">
              <span className="hugeicons--date-time"></span>
              <input
                type="number"
                min="1"
                name="total_day"
                value={formData.total_day}
                onChange={handleChange}
              />
            </label>

            <label className="label_title">Remarks</label>
            <textarea
              className="textarea w-full border-[#243c5a]/10 outline-accent text-[16px]"
              name="note"
              value={formData.note}
              onChange={handleChange}
            />
          </form>

          <button
            className="btn btn-soft btn-lg btn-accent w-full mt-8"
            disabled={!isFormValid || submitting}
            onClick={handleSubmit}
          >
            {submitting ?  <WaitLoading /> : "Submit" }
          </button>
        </div>
          {isQuotaExceeded && (
            <p className="text-center text-error text-sm mt-2">
              {formData.type === "Private pay" &&
                `Quota exceeded. You can only use ${4 - quota.privatePay} more day(s)`}

              {formData.type === "Annual" &&
                `Quota exceeded. You can only use ${6 - quota.annual} more day(s)`}
            </p>
          )}
      </main>
    </div>
  );
}
