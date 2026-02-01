"use client";

import { Loading } from "@/app/components/loading";
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
  todayDone,
  geo,
  photo,
  submitting,
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
          {mode === "IN" ? "Check In" : "Check Out"}
        </button>

        {todayDone && (
              <div className="fixed inset-0 z-40 bg-black/50  flex items-center justify-center">
                <div className="pl-8 pr-8 text-center">

                  <div className="text-5xl mb-4">
                    <span className="pepicons-print--lock-open"></span>
                  </div>

                  <h2 className="text-[20px] font-bold mb-2">
                    Today's Check in Completed
                  </h2>

                  <p className="text-[16px] text-gray-700 mb-6 leading-relaxed">
                    You have already <b>checked in</b> and <b>checked out</b> today.
                    <br />
                    Would you like to check in again?
                  </p>

                  <div className="flex flex-col gap-3">
                    <button
                      className="btn btn-success btn-lg w-full"
                      onClick={() => {
                        forceNewCheckin(); 
                      }}
                    >
                      Check in again
                    </button>

                    <button
                      className="btn btn-outline btn-lg w-full"
                      onClick={() => {
                        if (window.liff) window.liff.closeWindow();
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
            </div>
          )}
      </main>
    </div>
  );
}
