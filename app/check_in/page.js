"use client";

import { Loading } from "@/app/components/loading";
import { WaitLoading } from "@/app/components/wait_loading";
import { liff_init } from "@/helper/liff_Init";
import { useCheckinLogic } from "@/script/use_checkin_logic";
import StatusSection from "../components/status_section";
import InfoSection from "../components/info_section";
import CameraSection from "../components/camera_section";
import TodayDoneOverlay from "@/app/components/pages/today_done_overlay";

export default function CheckinPage() {
  const { profile, loading } = liff_init();
  const logic = useCheckinLogic(profile);

  if (loading) return <Loading />;
  if (!profile) return <Loading />;

const {
  mode,
  todayDone,
  geo,
  photo,
  submitting,
  justCheckedOut,
  handleGPS,
  handleSubmit,
  forceNewCheckin,
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
          className={`btn btn-soft btn-lg w-full mt-5
            ${mode === "IN" ? "btn-accent" : "btn-secondary"}
          `}
        >
          {submitting ? <WaitLoading /> : (mode === "IN" ? "Check In" : "Check Out")}
        </button>


        {todayDone && !justCheckedOut && (
          <TodayDoneOverlay
            onCheckinAgain={forceNewCheckin}
            onClose={() => window.liff?.closeWindow()}
          />
        )}
      </main>
    </div>
  );
}
