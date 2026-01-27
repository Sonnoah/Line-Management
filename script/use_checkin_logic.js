import { useEffect, useRef, useState } from "react";
import {
  getTodayCheckin,
  checkIn,
  checkOut
} from "@/lib/check_in_service";

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

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const resetSession = () => {
    setStatus("Please Confirm Your Location");
    setStatusType("idle");
    setGeo(null);
    setTimeText("");
    setPhoto(null);
    setShowCamera(false);
  };

  const retakePhoto = () => {
    setPhoto(null);
    setShowCamera(false);
    setTimeout(() => setShowCamera(true), 0);
  };

  useEffect(() => {
    if (!profile) return;

    async function loadToday() {
      const today = new Date().toISOString().slice(0, 10);
      const docSnap = await getTodayCheckin(profile.userId, today);

      if (docSnap) {
        setMode(docSnap.data().status === "DONE" ? "IN" : "OUT");
        setCheckinId(docSnap.id);
      }
    }

    loadToday();
  }, [profile]);

  useEffect(() => {
    if (!showCamera || !videoRef.current) return;

    let stream;
    async function openCamera() {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    }
    openCamera();

    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [showCamera]);

  const handleGPS = () => {
    navigator.geolocation.getCurrentPosition(
      pos => {
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

        setShowCamera(true);
      },
      () => {
        setStatus("Unable to access location");
        setStatusType("error");
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

  const today = new Date().toISOString().slice(0, 10);

  try {
    if (mode === "IN") {
      const id = await checkIn(profile.userId, today, geo, photo);

      setCheckinId(id);

      setMode("OUT");

      setGeo(null);
      setPhoto(null);
      setShowCamera(false);
      setTimeText("");

      setStatus("Checked in successfully");
      setStatusType("success");

    } else if (mode === "OUT") {
      await checkOut(checkinId, geo, photo);

      setStatus("Checked out successfully");
      setStatusType("success");

      setMode("IN");
      setCheckinId(null);
      resetSession();
    }
  } catch (e) {
    console.error(e);
    setStatus("Submit failed");
    setStatusType("error");
  } finally {
    setSubmitting(false);
  }
};
  return {
    mode,
    status,
    statusType,
    geo,
    timeText,
    photo,
    showCamera,
    submitting,
    videoRef,
    canvasRef,
    handleGPS,
    takePhoto,
    handleSubmit,
    retakePhoto,
  };
}
