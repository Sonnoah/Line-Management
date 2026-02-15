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
import { Loading } from "@/app/components/loading";
import { getUser } from "@/script/get_user";
import { onSnapshot } from "firebase/firestore";
import Swal from "sweetalert2";


export default function Main() {
  const { profile, loading } = liff_init();
  const [data, setData] = useState(null);
  const [checkInStart, setCheckInStart] = useState(null);
  const [workedSeconds, setWorkedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [userData, setUserData] = useState(null);
  const [lastCheckInTime, setLastCheckInTime] = useState(null);
  const [lastCheckOutTime, setLastCheckOutTime] = useState(null);

  const WORK_SECONDS_PER_DAY =
    userData?.department === "Production"
      ? 8.5 * 60 * 60
      : 9 * 60 * 60 ;

  const isOT = workedSeconds > WORK_SECONDS_PER_DAY;   
  useEffect(() => {
    if (!profile || !userData) return;

    const q = query(
      collection(db, "Checkins"),
      where("userId", "==", profile.userId),
      orderBy("createdAt", "desc"),
      limit(1)
    );


  const unsubscribe = onSnapshot(q, (snap) => {
    if (snap.empty) {
      setData(null);
      setIsRunning(false);
      setWorkedSeconds(0);
      setCheckInStart(null);
      setLastCheckInTime(null);
      setLastCheckOutTime(null);
      return;
    }

    const last = snap.docs[0].data();
    setData(last);

    setLastCheckInTime(last.checkInAt?.toDate() ?? null);
    setLastCheckOutTime(last.checkOutAt?.toDate() ?? null);

    if (last.status === "IN" && last.checkInAt) {
      const checkInMs = last.checkInAt.toDate().getTime();
      setCheckInStart(checkInMs);
      setIsRunning(true);
      return;
    }

  
    if (
      (last.status === "OUT" || last.status === "DONE") &&
      typeof last.workedMinutes === "number"
    ) {
      setIsRunning(false);
      setCheckInStart(null);
      setWorkedSeconds(last.workedMinutes * 60);
    }
  });

  return () => unsubscribe();
}, [profile?.userId, userData?.department]);



    useEffect(() => {
      if (!profile?.userId) return;

      async function loadUser() {
        const user = await getUser(profile.userId);
        setUserData(user);
      }

      loadUser();
  }, [profile]);


  useEffect(() => {
    if (!isRunning || !checkInStart) return;

    const timer = setInterval(() => {
      const worked = Math.floor(
        (Date.now() - checkInStart) / 1000
      );
      setWorkedSeconds(worked);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, checkInStart]);



  if (loading) return <Loading />;

  // const isCheckedOut = data?.status === "DONE";


  const workHMS = {
    h: Math.floor(workedSeconds / 3600),
    m: Math.floor((workedSeconds % 3600) / 60),
    s: workedSeconds % 60,
  };

  const remainingSeconds = Math.max(
    0,
    WORK_SECONDS_PER_DAY - workedSeconds
  );

  const overtimeSeconds = Math.max(
    0,
    workedSeconds - WORK_SECONDS_PER_DAY
  );

  const remainingHMS = {
    h: Math.floor(remainingSeconds / 3600),
    m: Math.floor((remainingSeconds % 3600) / 60),
    s: remainingSeconds % 60,
  };

  const overtimeHMS = {
    h: Math.floor(overtimeSeconds / 3600),
    m: Math.floor((overtimeSeconds % 3600) / 60),
    s: overtimeSeconds % 60,
  };

  return (
      <div className="wrap">
      <main className="home-container">
        <div className="flex items-center justify-between mb-3">
          <h3 className="uppercase text-[16px] font-bold">
            Today's Working Summary
          </h3>

          <span
            className={`badge badge-lg rounded-full text-sm ${
              userData?.department === "Production"
                ? "bg-info/10 text-info"
                : userData?.department === "Office"
                ? "bg-info/10 text-info"
                : "bg-base-200 text-base-content"
            }`}
          >
            {userData?.department ?? "No Department"}
          </span>
        </div>

        <div className="flex w-full gap-2">
          <div className="stats shadow flex-1">
            <div className="stat p-3">
            <div className="stat-figure text-info">
              <span className="streamline-ultimate--work-from-home-user-pet-cat-bold" />
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
                <span className="countdown text-[16px] text-black">
                  --:--
                </span>
              ) : (
                <span className="countdown font-sans text-[16px]">
                  <span style={{ "--value": workHMS.h, "--digits": 2 }}>{workHMS.h}</span>:
                  <span style={{ "--value": workHMS.m, "--digits": 2 }}>{workHMS.m}</span>:
                  <span style={{ "--value": workHMS.s, "--digits": 2 }}>{workHMS.s}</span>
                </span>
              )}
            </div>

            <div className="stat-desc">Hrs</div>
          </div>
        </div>

        <div className="stats shadow flex-1">  
          <div className="stat p-3">
            <div className="stat-figure text-info">
              <span className="fluent--clock-toolbox-20-filled" />
            </div>

            <div className="stat-title">
              {!data
                ? "Time Balance"
                : isOT
                ? "Overtime"
                : "Remaining"}
            </div>
              <div
                className={`stat-value transition-opacity flex items-center gap-1 ${
                  !data
                    ? "text-base-content"
                    : !isRunning
                    ? "text-black opacity-50"
                    : isOT
                    ? "text-success"
                    : "text-warning"
                }`
              }
              >
                {!data ? (
                  <span className="text-[16px] text-black opacity-50">--:--</span>
                ) : isOT ? (
                  <>
                    <span className="text-[16px]">+</span>
                    <span className="countdown font-sans text-[16px]">
                      <span style={{ "--value": overtimeHMS.h, "--digits": 2 }}>
                        {overtimeHMS.h}
                      </span>
                      :
                      <span style={{ "--value": overtimeHMS.m, "--digits": 2 }}>
                        {overtimeHMS.m}
                      </span>
                      :
                      <span style={{ "--value": overtimeHMS.s, "--digits": 2 }}>
                        {overtimeHMS.s}
                      </span>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[16px]">-</span>
                    <span className="countdown font-sans text-[16px]">
                      <span style={{ "--value": remainingHMS.h, "--digits": 2 }}>
                        {remainingHMS.h}
                      </span>
                      :
                      <span style={{ "--value": remainingHMS.m, "--digits": 2 }}>
                        {remainingHMS.m}
                      </span>
                      :
                      <span style={{ "--value": remainingHMS.s, "--digits": 2 }}>
                        {remainingHMS.s}
                      </span>
                    </span>
                  </>
                )}
              </div>
            <div className="stat-desc">Hrs</div>
          </div>     
        </div>
        
      </div>
       <div className="mt-3 flex justify-between text-base-content/60 text-sm">
        <div>
          <span>Last Check in : </span>{" "}
          {lastCheckInTime
            ? lastCheckInTime.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-"} 
        </div>

        {!isRunning && lastCheckOutTime && (
          <div>
            <span>Last Check out :</span>{" "}
            {lastCheckOutTime.toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>
      </main>
    </div>
  );
}
