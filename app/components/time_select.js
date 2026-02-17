"use client";
import { useState } from "react";

export default function TimeSelect() {
  const [hour, setHour] = useState("08");
  const [minute, setMinute] = useState("00");

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  const checkIn = `${hour}:${minute}`;

  return (
    <div className="flex gap-2">
      <select
        value={hour}
        onChange={(e) => setHour(e.target.value)}
        className="select w-1/2"
      >
        {hours.map((h) => (
          <option key={h}>{h}</option>
        ))}
      </select>

      <select
        value={minute}
        onChange={(e) => setMinute(e.target.value)}
        className="select w-1/2"
      >
        {minutes.map((m) => (
          <option key={m}>{m}</option>
        ))}
      </select>
    </div>
  );
}
