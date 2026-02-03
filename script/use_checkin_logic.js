"use client";

import { useEffect, useRef, useState } from "react";
import {
  getTodayCheckin,
  checkIn,
  checkOut
} from "@/lib/check_in_service";
import { getUser } from "@/script/get_user";
import Swal from "sweetalert2";

export function useCheckinLogic(profile) {
  const [mode, setMode] = useState("IN");
  const [status, setStatus] = useState("Please Confirm Your Location");
  const [statusType, setStatusType] = useState("idle");
  const [geo, setGeo] = useState(null);
  const [timeText, setTimeText] = useState("");
  const [photo, setPhoto] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checkinId, setCheckinId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [todayDone, setTodayDone] = useState(false);
  const [forceMode, setForceMode] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [today, setToday] = useState(
  new Date().toISOString().slice(0, 10)
);

  async function checkCameraPermission() {
  if (!navigator.permissions) return "prompt";

  try {
    const result = await navigator.permissions.query({ name: "camera" });
    return result.state; 
  } catch {
    return "prompt";
  }
}


  const resetSession = () => {
    setStatus("Please Confirm Your Location");
    setStatusType("idle");
    setGeo(null);
    setPhoto(null);
    setShowCamera(false);
  };

  const forceNewCheckin = () => {
    setForceMode(true); 
    setTodayDone(false); 
    setMode("IN");
    setCheckinId(null);
    resetForNewCheckin();
  };

  const resetForNewCheckin = () => {
    setStatus("Please Confirm Your Location");
    setStatusType("idle");
    setGeo(null);
    setTimeText("");      
    setPhoto(null);
    setShowCamera(false);
};

  const resetAfterCheckout = () => {
    setGeo(null);
    setPhoto(null);
    setShowCamera(false);

  };

  const retakePhoto = () => {
    setPhoto(null);
    setShowCamera(false);
    setTimeout(() => setShowCamera(true), 0);
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toISOString().slice(0, 10);
      setToday(prev => (prev !== now ? now : prev));
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    setJustCheckedOut(false);
    setForceMode(false);
  }, [today]);


  useEffect(() => {
    if (!profile) return;

    async function loadToday() {
      const docSnap = await getTodayCheckin(profile.userId, today);

      if (forceMode) return;

      if (!docSnap) {
        setMode("IN");
        setCheckinId(null);
        setTodayDone(false);
        return;
      }

      const data = docSnap.data();

      if (data.date !== today) {
        setTodayDone(false);
        setMode("IN");
        setCheckinId(null);
        return;
      }

      if (data.status === "DONE") {
        setTodayDone(true);
        setMode("IN");
        setCheckinId(null);
      } else {
        setTodayDone(false);
        setMode("OUT");
        setCheckinId(docSnap.id);
      }
    }

    loadToday();
  }, [profile, forceMode, today]);



  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!todayDone) {
        console.log("New day but still working — no reset");
        return;
      }

      console.log("New day & work completed — reset");

      const newToday = new Date().toISOString().slice(0, 10);

      setToday(newToday);
      setTodayDone(false);
      setMode("IN");
      setCheckinId(null);
      setJustCheckedOut(false);
      setForceMode(false);

      setStatus("Please Confirm Your Location");
      setStatusType("idle");
      setGeo(null);
      setPhoto(null);
      setShowCamera(false);
    }, msUntilNextDayBangkok());

    return () => clearTimeout(timeout);
  }, [todayDone]);


  useEffect(() => {
    const onFocus = () => {
      const now = new Date().toISOString().slice(0, 10);

      if (now !== today && todayDone) {
        console.log("Focus detected new day — reset");

        setToday(now);
        setTodayDone(false);
        setMode("IN");
        setCheckinId(null);
      }
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [today, todayDone]);



  useEffect(() => {
    if (!profile?.userId) return;

    async function loadUser() {
      const user = await getUser(profile.userId);
      console.log("userData from firestore", user); 
      setUserData(user);
    }

    loadUser();
  }, [profile]);


useEffect(() => {
  if (!showCamera || !videoRef.current) return;

  let stream;

  async function openCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera error", err);

      Swal.fire({
        icon: "error",
        title: "Camera unavailable",
        text: "Unable to access camera. Please check permission or open in browser.",
      });

      if (window.liff) {
        window.open(window.location.href, "_blank");
      }
    }
  }

  openCamera();

  return () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
  };
}, [showCamera]);


  const handleGPS = async () => {
    Swal.fire({
      title: "Getting location",
      text: "Please wait a moment",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    navigator.geolocation.getCurrentPosition(
      async pos => {
        Swal.close();

        const geoData = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setGeo(geoData);
        setStatus("Current location confirmed");
        setStatusType("success");

        const time = new Date().toLocaleString("en-US", {
          timeZone: "Asia/Bangkok",
          timeStyle: "short",
          hour12: false,
        });

        setTimeText(
          mode === "IN"
            ? "Checked in at " + time
            : "Checked out at " + time
        );

        const camPermission = await checkCameraPermission();

        if (camPermission === "denied") {
          Swal.fire({
            icon: "warning",
            title: "Camera permission denied",
            html: `
              <p>Please enable camera permission manually</p>
              <ol style="text-align:left">
                <li>LINE App info</li>
                <li>Permissions</li>
                <li>Allow Camera</li>
              </ol>
            `,
          });
          return;
        }

        setShowCamera(true);
      },
      error => {
        Swal.close();
        setStatus("Unable to access location");
        setStatusType("error");

        Swal.fire({
          icon: "error",
          title: "Location Error",
          text: "Location access failed",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    );
  };



  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    setPhoto(canvas.toDataURL("image/jpeg"));

    const stream = video.srcObject;
    if (stream) stream.getTracks().forEach(t => t.stop());
    video.srcObject = null;
  };

  const handleSubmit = async () => {
  if (submitting) return;
  setSubmitting(true);

  const department = userData?.department;

  if (!geo || !photo) {
    setStatus("Please confirm location and photo");
    setStatusType("error");
    setSubmitting(false);
    return;
  }

  const today = new Date().toISOString().slice(0, 10);

  try {
    if (mode === "IN") {
      const id = await checkIn(profile.userId, today, geo, photo ,department );

      Swal.fire({
        icon: "success",
        title: "CHECK IN",
        text: "Your check in information has been received",
        width: 300, 
        timer: 3000,
        showConfirmButton: false,
      });
      setCheckinId(id);

      setStatus("Checked in successfully");
      setStatusType("success");

      setMode("OUT");
      resetSession();

    } else if (mode === "OUT") {
      await checkOut(checkinId, geo, photo, department );

         Swal.fire({
            icon: "success",
            title: "CHECK OUT",
            text: "Your check out information has been received",
            timer: 3000,
            showConfirmButton: false,
          });
  
      setStatus("Checked out successfully");
      setStatusType("success");

      setTodayDone(true);  
      setJustCheckedOut(true);  
      setForceMode(false); 

      setMode("IN");
      setCheckinId(null);
      resetAfterCheckout();
    }

  } catch (e) {
  console.error("CHECKIN ERROR:", e);

  Swal.fire({
    icon: "error",
    title: "Submit failed",
    showConfirmButton: false,
    text: e.message || "Unknown error",
  });

  setStatus("Submit failed");
  setStatusType("error");


  } finally {
    setSubmitting(false);
  }
  console.log("profile", profile);
};
  return {
    mode,
    todayDone,
    status,
    statusType,
    geo,
    timeText,
    photo,
    showCamera,
    submitting,
    videoRef,
    canvasRef,
    forceNewCheckin,
    handleGPS,
    takePhoto,
    handleSubmit,
    retakePhoto,
  };
}
