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
import { useLiff } from "@/lib/use_liff";
import { Loading } from "@/app/components/loading";
import { getUser } from "@/script/get_user";

const WORK_MINUTES_PER_DAY = 9 * 60;

export default function Home() {
  const { profile, loading } = useLiff();

  const [data, setData] = useState(null);

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
        setIsRunning(false);
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

  useEffect(() => {
    if (!isRunning || !checkInStart) return;

    const timer = setInterval(() => {
      const diffMs = Date.now() - checkInStart;
      setWorkedSeconds(Math.floor(diffMs / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, checkInStart]);

  if (loading) return <Loading />;

  const isCheckedOut = data?.status === "DONE";

  const workedMinutes =
    data === null
      ? null
      : isRunning
      ? Math.floor(workedSeconds / 60)
      : data.workedMinutes ?? 0;

  const diffMinutes =
    workedMinutes === null ? null : workedMinutes - WORK_MINUTES_PER_DAY;

  const workHMS = {
    h: Math.floor(workedSeconds / 3600),
    m: Math.floor((workedSeconds % 3600) / 60),
    s: workedSeconds % 60,
  };

  const targetSeconds = WORK_MINUTES_PER_DAY * 60;

  const diffSeconds =
    data === null ? null : targetSeconds - workedSeconds;

  const isOvertime = diffSeconds !== null && diffSeconds < 0;

  const balanceSecondsAbs =
    diffSeconds === null ? null : Math.abs(diffSeconds);

  const balanceHMS =
    balanceSecondsAbs === null
      ? null
      : {
          h: Math.floor(balanceSecondsAbs / 3600),
          m: Math.floor((balanceSecondsAbs % 3600) / 60),
          s: balanceSecondsAbs % 60,
        };

  const balanceSign =
    diffSeconds === null
      ? ""
      : diffSeconds < 0
      ? "+"
      : "-";


  return (
    <div className="wrap">
      <main className="home-container">
        <h3 className="uppercase text-[16px] font-bold mb-3">
          Today's Working Summary
        </h3>

        <div className="stats shadow w-full">
          <div className="stat p-3">
            <div className="stat-figure text-secondary">
              <span className="streamline-ultimate--co-working-space-laptop" />
            </div>

            <div className="stat-title">
              {isRunning ? "Working" : !data ? "Empty record" : "Worked"}
            </div>

            <div
              className={`stat-value transition-opacity ${
                isRunning ? "text-black" : "text-black opacity-50"
              }`}
            >
              {!data ? (
                <span className="countdown text-lg text-black opacity-50">
                  --:--
                </span>
              ) : (
                <span className="countdown font-mono text-lg">
                  <span style={{ "--value": workHMS.h, "--digits": 2 }}>{workHMS.h}</span>:
                  <span style={{ "--value": workHMS.m, "--digits": 2 }}>{workHMS.m}</span>:
                  <span style={{ "--value": workHMS.s, "--digits": 2 }}>{workHMS.s}</span>
                </span>
              )}
            </div>

            <div className="stat-desc">hrs</div>
          </div>

          <div className="stat p-3">
            <div className="stat-figure text-secondary">
              <span className="duo-icons--clock" />
            </div>

            <div className="stat-title">
              {diffMinutes === null
                ? "Time Balance"
                : diffMinutes >= 0
                ? "Overtime"
                : "Remaining"}
            </div>

           <div className={`stat-value transition-opacity flex items-center gap-1 ${
              diffMinutes === null
                ? "text-base-content"
                : isCheckedOut
                ? "text-black opacity-50"
                : diffMinutes >= 0
                ? "text-success"
                : "text-warning"
            }`}
          >
            {balanceHMS === null ? (
              <span className="text-lg text-black opacity-50">
                --:--
              </span>
            ) : (
              <>
                <span className="text-lg">
                  {diffSeconds < 0 ? "+" : "-"}
                </span>

                <span className="countdown font-mono text-lg">
                  <span style={{ "--value": balanceHMS.h, "--digits": 2 }}>{balanceHMS.h}</span>:
                  <span style={{ "--value": balanceHMS.m, "--digits": 2 }}>{balanceHMS.m}</span>:
                  <span style={{ "--value": balanceHMS.s, "--digits": 2 }}>{balanceHMS.s}</span>
                </span>
              </>
            )}
          </div>
            <div className="stat-desc">hrs</div>
          </div>
        </div>
      </main>
    </div>
  );
}
