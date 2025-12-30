"use client";

import { useState } from "react";
import { update_username } from "../../script/update_username";

export default function EditUsername({ userId, currentUsername }) {
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(currentUsername || "");
  const [savedUsername, setSavedUsername] = useState(currentUsername || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function Save() {
    try {
      setLoading(true);
      setError("");

      await update_username(userId, username);

      setSavedUsername(username);

      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function Cancel() {
    setUsername(savedUsername);
    setEditing(false);
    setError("");
  }

  return (
    <div>
      <div className="userid-row">
        <label className="label_profile_title">User Name</label>

        <button
          type="button"
          className="profile_icon ml-2"
          onClick={() => {
            setUsername(savedUsername);
            setEditing(true);
          }}
        >
          <span className="cuida--edit-outline"></span>
        </button>
      </div>

      {!editing ? (
        <label className="label_profile">
          {savedUsername || (
            <span className="opacity-50">Anonymous</span>
          )}
        </label>
      ) : (
        <div className="flex items-center gap-2">
          <input
            className="input input-bordered input-sm text-[16px] focus:outline-hidden"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />

          <button
            className="btn btn-sm btn-accent"
            disabled={loading}
            onMouseDown={Save}
          >
            <span className="charm--tick"></span>
          </button>

          <button
            className="btn btn-sm btn-soft"
            onMouseDown={Cancel}
          >
            <span className="iconoir--cancel"></span>
          </button>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
