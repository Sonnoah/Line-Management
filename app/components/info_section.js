export default function InfoSection({ timeText, geo }) {
  return (
    <>
      {timeText && (
        <div className="info-card">
          <span className="tabler--clock" />
          <span className="status-sep">|</span>
          <div>{timeText}</div>
        </div>
      )}

      {geo && (
        <div className="info-card">
          <span className="pepicons-pencil--map" />
          <span className="status-sep">|</span>
          {geo.lat.toFixed(6)}, {geo.lng.toFixed(6)}
        </div>
      )}
    </>
  );
}
