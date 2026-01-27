"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase_config";
import { liff_init } from "@/helper/liff_Init";
import { Loading } from "@/helper/loading";

const WORK_MINUTES_PER_DAY = 9 * 60;

export default function Home() {
  const { profile, loading } = liff_init();

  const [data, setData] = useState(null);

  // realtime state
  const [checkInStart, setCheckInStart] = useState(null);
  const [workedSeconds, setWorkedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!profile) return;

    async function loadLastSession() {
      const q = query(
        collection(db, "Checkins"),
        where("userId", "==", profile.userId),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const snap = await getDocs(q);
      if (snap.empty) {
        setData(null);
        return;
      }

      const last = snap.docs[0].data();
      setData(last);

  
      if (last.status === "IN" && last.checkInAt) {
        setCheckInStart(last.checkInAt.toDate().getTime());
        setIsRunning(true);
      } else {
        setIsRunning(false);
      }
    }

    loadLastSession();
  }, [profile]);

  /* ================= REALTIME TIMER ================= */
  useEffect(() => {
    if (!isRunning || !checkInStart) return;

    const timer = setInterval(() => {
      const diffMs = Date.now() - checkInStart;
      setWorkedSeconds(Math.floor(diffMs / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, checkInStart]);

  if (loading) return <Loading />;

  /* ================= SAFE CALCULATION ================= */

  const isCheckedOut = data && data.status === "DONE";

  const workedMinutes =
    data === null
      ? null
      : isRunning
      ? Math.floor(workedSeconds / 60)
      : data.workedMinutes ?? 0;

  const diffMinutes =
    workedMinutes === null ? null : workedMinutes - WORK_MINUTES_PER_DAY;

  return (
    <div className="wrap">
      <main className="home-container">

        <h3 className="uppercase text-[16px] font-bold mb-3">Today's Working Summary</h3>

        <div className="stats shadow w-full">
          <div className="stat p-3">
            <div className="stat-figure text-secondary">
              <span class="streamline-ultimate--co-working-space-laptop"></span>
            </div>
            <div className="stat-title">
              {isRunning ? (
                <p>Working</p>
              ) : !data ? (
                <p>Empty record</p>
              ) : (
                <p>Worked</p>
              )}
            </div>
                <div className={`stat-value text-[20px] ${
                  !isRunning ? "text-black opacity-50" : "text-black"
                }`}
              >
                {workedMinutes === null
                  ? "-"
                  : `${(workedMinutes / 60).toFixed(2)}`}
              </div>
                  <div className="stat-desc">hrs</div>
              </div>

          <div className="stat p-3">
             <div className="stat-figure text-secondary">
              <span class="duo-icons--clock"></span>
            </div>
            <div className="stat-title">
              {diffMinutes === null
                ? "Time Balance"
                : diffMinutes >= 0
                ? "Overtime"
                : "Remaining"}
            </div>
            <div className={`stat-value text-[20px] ${
                diffMinutes === null
                  ? "text-base-content"
                  : isCheckedOut
                  ? "text-black opacity-50"
                  : diffMinutes >= 0
                  ? "text-success"
                  : "text-warning"
              }`}
            >
              {diffMinutes === null
                ? "-"
                : `${diffMinutes >= 0 ? "+ " : "- "}${Math.abs(
                    diffMinutes / 60
                  ).toFixed(2)}`}
            </div>
            <div className="stat-desc">hrs</div>
          </div>
        </div>
      </main>
    </div>
  );
}
