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
    setTimeout(() => {
      setShowCamera(true);
    }, 0);
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
      setShowCamera(true)
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

  const imageData = canvas.toDataURL("image/jpeg");
  setPhoto(imageData);


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
        const id = await checkIn(
          profile.userId,
          today,
          geo,
          photo
        );

        setCheckinId(id);

        setStatus("Checked in successfully");
        setStatusType("success");

        setTimeout(() => {
          setMode("OUT");
          resetSession();
        }, 600);

      } else if (mode === "OUT") {
        if (!checkinId) {
          setStatus("Session expired, please check in again");
          setStatusType("error");
          setMode("IN");
          resetSession();
          return;
        }

        await checkOut(checkinId, geo, photo);

        setStatus("Checked out successfully");
        setStatusType("success");

        setTimeout(() => {
          setCheckinId(null);
          setMode("IN");
          resetSession();
        }, 600);
      }

    } catch (e) {
      console.error(e);
      setStatus("Submit failed");
      setStatusType("error");
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
            <span
              className={`status-icon ${
                statusType === "success"
                  ? "tabler--map-check"
                  : statusType === "error"
                  ? "tabler--map-x"
                  : "tabler--map-2"
              }`}
            />
            <span className="status-sep">|</span>
            <span className="status-value">{status}</span>
          </div>

          <button
            className="btn btn-soft btn-accent btn-location"
            onClick={handleGPS}
          >
            <span className="mingcute--location-fill"></span>
          </button>
        </div>

        {timeText &&( 
          <div className="info-card">
            <span class="tabler--clock"></span>
            <span className="status-sep">|</span>
            <div>{timeText}</div>
          </div>
        )}
        
        {geo && (
          <div className="info-card">
            <span class="pepicons-pencil--map"></span> 
            <span className="status-sep">|</span>
            {geo.lat.toFixed(6)}, {geo.lng.toFixed(6)}
          </div>
        )}

        {showCamera && (
          <div className="video-wrapper">
            {!photo && (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="video"
                />
                <canvas ref={canvasRef} className="hidden" />

                 <button className="camera-shutter-overlay" onClick={takePhoto}>
                <span />
              </button>
              </>
            )}

           {photo && (
              <div className="photo-wrapper">
                <img
                  src={photo}
                  alt="Captured"
                  className="photo-preview"
                />

                <button
                  className="photo-close-btn"
                  onClick={retakePhoto}
                  aria-label="Retake photo"
                >
                  <span class="maki--cross"></span>
                </button>
              </div>
            )}


          </div>
        )}

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
