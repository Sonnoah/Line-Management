export default function CameraSection({
  showCamera,
  photo,
  videoRef,
  canvasRef,
  takePhoto,
  retakePhoto,
}) {
  if (!showCamera) return null;

  return (
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

          <button
            className="camera-shutter-overlay"
            onClick={takePhoto}
          >
            <span />
          </button>
        </>
      )}

      {photo && (
        <div className="photo-wrapper">
          <img src={photo} alt="Captured" className="photo-preview" />
          <button
            className="photo-close-btn"
            onClick={retakePhoto}
          >
            <span className="maki--cross" />
          </button>
        </div>
      )}
    </div>
  );
}
