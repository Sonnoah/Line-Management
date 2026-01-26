"use client";

import { useEffect, useRef, useState } from "react";
import { liff_init } from "@/helper/liff_Init";
import {
  getTodayCheckin,
  checkIn,
  checkOut
} from "@/state/check_in_service";
import { Loading } from "@/helper/loading";

export default function CheckinPage() {
  const { profile, loading } = liff_init();

  const [mode, setMode] = useState("IN");
  const [status, setStatus] = useState("Please Confirm Your Location");
  const [statusType, setStatusType] = useState("idle"); // idle | success | error
  const [geo, setGeo] = useState(null);
  const [timeText, setTimeText] = useState("");
  const [photo, setPhoto] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  /* ========= INIT (โหลดสถานะวันนี้) ========= */
  useEffect(() => {
    if (!profile) return;

    async function loadToday() {
      const today = new Date().toISOString().slice(0, 10);
      const snap = await getTodayCheckin(profile.userId, today);

      if (snap.exists()) {
        setMode(snap.data().timeOut ? "DONE" : "OUT");
      }
    }

    loadToday();
  }, [profile]);

  /* ========= CAMERA ========= */
  useEffect(() => {
    if (!showCamera || !videoRef.current) return;

    let stream;

    async function openCamera() {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    }

    openCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [showCamera]);

  if (loading) return <Loading />;
  if (!profile) return null;

  /* ========= GPS ========= */
  const handleGPS = () => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const geoData = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setGeo(geoData);
        setStatus("Current Location Confirmed");
        setStatusType("success");

        if (mode === "IN") {
          setTimeText("🕘 เวลาเช็คอิน: " + new Date().toLocaleTimeString());
          setShowCamera(true);
        } else {
          setTimeText("🕘 เวลาเช็คเอาท์: " + new Date().toLocaleTimeString());
        }
      },
      () => {
        setStatus("Unable to access location");
        setStatusType("error");
      }
    );
  };

  /* ========= TAKE PHOTO ========= */
  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    setPhoto(canvas.toDataURL("image/jpeg"));

    const stream = video.srcObject;
    if (stream) stream.getTracks().forEach(track => track.stop());
    video.srcObject = null;
  };

  /* ========= SUBMIT ========= */
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    const today = new Date().toISOString().slice(0, 10);

    try {
      if (mode === "IN") {
        await checkIn(profile.userId, today, geo);
        setMode("OUT");
        alert("เช็คอินสำเร็จ");
      } else if (mode === "OUT") {
        await checkOut(profile.userId, today, geo);
        setMode("DONE");
        alert("เช็คเอาท์สำเร็จ");
      }
    } catch (e) {
      console.error(e);
      alert("บันทึกไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="wrap">
      <main className="checkin-container">

        <div className="header">
          <h2 className={`mode-title ${mode === "IN" ? "in" : "out"}`}>
            {mode === "IN" ? "CHECK IN" : "CHECK OUT"}
          </h2>
        </div>

        <div className="status-row">
          <div className={`status-field ${statusType}`}>
            {/* <span className="status-label">STATUS</span>
            <span className="status-sep">|</span> */}
            <span
              className={`status-icon ${
                statusType === "success"
                  ? "tabler--map-check"
                  : statusType === "error"
                  ? "tabler--map-x"
                  : "tabler--map-2"
              }`}
            />
            <span className="status-value">{status}</span>
          </div>

          <button
            className="btn btn-soft btn-accent btn-location"
            onClick={handleGPS}
          >
            <span className="mingcute--location-fill"></span>
          </button>
        </div>

        {timeText && <div className="info-card">{timeText}</div>}
        {geo && (
          <div className="info-card">
            📍 {geo.lat.toFixed(6)}, {geo.lng.toFixed(6)}
          </div>
        )}

        {showCamera && (
          <div className="camera-card">
            <video ref={videoRef} autoPlay playsInline muted className="video" />
            <canvas ref={canvasRef} className="hidden" />
            {!photo && (
              <button className="btn camera" onClick={takePhoto}>
                📸 ถ่ายรูปยืนยัน
              </button>
            )}
          </div>
        )}

        <button
          disabled={!geo || submitting || (mode === "IN" && !photo)}
          onClick={handleSubmit}
          className="btn submit"
        >
          {mode === "IN" ? "✅ เช็คอิน" : "🚪 เช็คเอาท์"}
        </button>

      </main>
    </div>
  );
}
