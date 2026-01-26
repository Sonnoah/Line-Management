"use client";

import { useState } from "react";
import { update_username } from "../../script/update_username";
import { useEffect } from "react";
import ConfirmDialog from "./confirm_dialog";

export default function EditUsername({ userId, onUsernameUpdated, currentUsername }) {
  const [confirmEdit, setConfirmEdit] = useState(false);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [confirmSave, setConfirmSave] = useState(false);
  const [savedUsername, setSavedUsername] = useState(currentUsername || "");
  const [confirmSame, setConfirmSame] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setUsername(currentUsername ?? "");
    setSavedUsername(currentUsername ?? "");
  }, [currentUsername]);

  return (
    <div>
      <div className="userid-row">
        <label className="label_profile_title opacity-50">User Name</label>

        <button
          type="button"
          className="profile_icon ml-2"
          onMouseDown={(e) => {
            e.stopPropagation(); 
            setUsername(savedUsername);
            setConfirmEdit(true);
          }}
        >
          <span className="cuida--edit-outline"></span>
        </button>
      </div>

      <ConfirmDialog
        open={confirmEdit}
        title="Confirm Edit"
        message="Do you want to edit this username ?"
        variant="success"
        confirmText="Edit"
        onCancel={() => setConfirmEdit(false)}
        onConfirm={() => {
          setConfirmEdit(false);
          setEditing(true);
        }}
      />

      <label className="label_profile">
        {savedUsername || <span className="opacity-50">Anonymous</span>}
      </label>

      <ConfirmDialog
        open={editing}
        title="Edit Username"
        confirmText="Save"
        variant="success"
        loading={loading}
        message={
          <>
            <div className="mb-2">
              <p className="uppercase text-[14px] font-bold opacity-50">
                Current username
              </p>
              <div className="input input-bordered input-sm w-full bg-base-200 text-[16px] opacity-50 mt-1 flex items-center gap-2">
                <span class="mingcute--user-3-line opacity-50"></span>
                {savedUsername || "Anonymous"}
              </div>
            </div>

            <div className="mt-3">
              <p className="uppercase text-[14px] font-bold opacity-50">
                New username
              </p>
              <label className="input input-bordered input-sm w-full mt-1 flex items-center gap-2 border-[#243c5a]/10 outline-accent/50">
                <span className="mingcute--user-edit-line opacity-30"></span>
                <input
                  className="text-[16px]"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
              </label>
            </div>

            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </>
        }
        onCancel={() => {
        setEditing(false);
        setUsername(savedUsername);;
        }}
        
        onConfirm={() => {
          const isSame =
            username.trim().toLowerCase() ===
            savedUsername.trim().toLowerCase();

          if (isSame) {
            setConfirmSame(true);
            return;
          }

          setEditing(false);
          setConfirmSave(true);
        }}
      />

      <ConfirmDialog
        open={confirmSame}
        title="Username Already Used"
        message={
                <>
                  You are already using the username
                  <b className="mx-1">{savedUsername}</b>
                  <p className="text-sm opacity-60 mt-2">
                    Please choose a different username.
                  </p>
                </>
              }
        confirmText="Edit"
        cancelText="Close"
        variant="success"
        onConfirm={() => {
          setConfirmSame(false);
          setEditing(true);
        }}
        onCancel={() => {
          setEditing(false);
          setConfirmSame(false);
        }}
      />


      <ConfirmDialog
        open={confirmSave}
        title="Confirm Save"
        message={
          <>
            Are you sure, you want to change username to <b>{username}</b> ?
          </>
        }
        confirmText="Confirm"
        variant="success"
        loading={loading}
        onCancel={() => {
          setConfirmSave(false);
          setEditing(true); 
        }}
        onConfirm={async () => {
          setConfirmSave(false);
          setLoading(true);

          try {
            await update_username(userId, username);
            setSavedUsername(username);
            onUsernameUpdated?.(username);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        }}
      />
    </div>
  );
}
