"use client";

import { forwardRef, useEffect, useState } from "react";
import { updateUserRole } from "@/script/update_user_role";

const Actions_popup = forwardRef(({ profile, onRoleUpdated }, ref) => {

  const [editingRole, setEditingRole] = useState(false);
  const [role, setRole] = useState("");


  const [actions, setActions] = useState({
    action1: false,
    action2: false,
  });

  useEffect(() => {
    if (profile) {
      setRole(profile.role || "");
      setEditingRole(false);
      setActions({
        action1: false,
        action2: false,
      });
    }
  }, [profile]);

  function toggleAction(name) {
    setActions(prev => ({
      ...prev,
      [name]: !prev[name],
    }));
  }


  if (!profile) return null;

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box font-normal">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <div className="flex items-center gap-8 py-2">
          <img
            src={profile.pictureUrl}
            alt="profile"
            className="w-28 h-28 mask mask-squircle"
          />

          <div className="flex flex-col">
            <div>
              <p className="label_admin_title">Display Name</p>
              <span className="label_admin">{profile.displayName}</span>
            </div>

            <div>
              <p className="label_admin_title text-[12px]">User Name</p>
              <span className="label_admin">{profile.username || "-"}</span>
            </div>
            <div>
              <div className="userid-row items-center">
                <p className="label_admin_title text-[12px]">Role</p>
                {!editingRole && (
                  <button
                    type="button"
                    onClick={() => setEditingRole(true)}
                    className="profile_icon ml-2"
                  >
                    <span className="cuida--edit-outline"></span>
                  </button>
                )}
              </div>

              {!editingRole ? (
                <span className="label_admin">{role}</span>
              ) : (
                <select
                  className="select select-sm select-ghost "
                  value={role}
                  autoFocus
                  onChange={async (e) => {
                    const newRole = e.target.value;
                    setRole(newRole);

                    await updateUserRole(profile.userId, newRole);

                    onRoleUpdated?.(profile.userId, newRole);

                    setEditingRole(false);
                  }}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              )}
            </div>
          </div>
        </div>

        <div className="divider text-[16px]">Actions</div>
        <div className="flex items-center justify-between py-2">
          <p className="m-0">Actions 1</p>
          <input
            type="checkbox"
            className="toggle toggle-accent"
            checked={actions.action1}
            onChange={() => toggleAction("action1")}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <p className="m-0">Actions 2</p>
          <input
            type="checkbox"
            className="toggle toggle-accent"
            checked={actions.action2}
            onChange={() => toggleAction("action2")}
          />
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

export default Actions_popup;
