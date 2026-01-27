"use client";

import { Loading } from "@/helper/loading";
import { liff_init } from "@/helper/liff_Init";
import { useCheckinLogic } from "@/script/use_checkin_logic";
import StatusSection from "../components/status_section";
import InfoSection from "../components/info_section";
import CameraSection from "../components/camera_section";

export default function CheckinPage() {
  const { profile, loading } = liff_init();
  const logic = useCheckinLogic(profile);

  if (loading) return <Loading />;
  if (!profile) return null;

  const {
    mode,
    geo,
    photo,
    submitting,
    handleGPS,
    handleSubmit,
  } = logic;

  return (
    <div className="wrap">
      <main className="checkin-container">
        <div className="header">
          <h2 className={`mode-title ${mode === "IN" ? "in" : "out"}`}>
            {mode === "IN" ? "CHECK IN" : "CHECK OUT"}
          </h2>
        </div>

        <StatusSection {...logic} onGPS={handleGPS} />
        <InfoSection {...logic} />
        <CameraSection {...logic} />

        <button
          disabled={!geo || submitting || !photo}
          onClick={handleSubmit}
          className="btn btn-soft btn-success w-full mt-5"
        >
          {mode === "IN" ? "Check In" : "Check Out"}
        </button>

      </main>
    </div>
  );
}
