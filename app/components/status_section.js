export default function StatusSection({
  status,
  statusType,
  onGPS
}) {
  return (
    <div className="status-row">
      <div className={`status-field ${statusType}`}>
        <span className={`status-icon ${
          statusType === "success"
            ? "tabler--map-check"
            : statusType === "error"
            ? "tabler--map-x"
            : "tabler--map-2"
        }`} />
        <span className="status-sep">|</span>
        <span className="status-value">{status}</span>
      </div>

      <button
        className="btn btn-soft btn-accent btn-location"
        onClick={onGPS}
      >
        <span className="mingcute--location-fill" />
      </button>
    </div>
  );
}
