"use client";

import { forwardRef, useEffect, useState } from "react";
import { updateUserRole } from "@/script/update_user_role";
import ConfirmDialog from "./confirm_dialog";

const Detail_popup = forwardRef(({ profile, onRoleUpdated }, ref) => {

  const [editingRole, setEditingRole] = useState(false);
  const [role, setRole] = useState("");
  const [pendingRole, setPendingRole] = useState(""); 

  const [confirmEdit, setConfirmEdit] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);


  useEffect(() => {
    if (profile) {
      setRole(profile.role || "");
      setEditingRole(false);
    }
  }, [profile]);

  function resetAll() {
    setEditingRole(false);
    setConfirmEdit(false);
    setConfirmSave(false);

    setPendingRole("");
    setRole(profile?.role || "");
  }

  if (!profile) return null;

  return (
    <dialog ref={ref} className="modal" onClose={resetAll}>
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

          <div className="flex flex-col gap-2">
            <div>
              <p className="label_admin_title opacity-50">Display Name</p>
              <span className="label_admin">{profile.displayName}</span>
            </div>

            <div>
              <p className="label_admin_title opacity-50">User Name</p>
              <span className="label_admin">{profile.username || "-"}</span>
            </div>
            <div>
              <div className="userid-row items-center">
                <p className="label_admin_title opacity-50">Role</p>

              {!editingRole && (
                <button
                  type="button"
                  onClick={() => setConfirmEdit(true)}
                  className="profile_icon ml-2">
                  <span className="cuida--edit-outline"></span>
                </button>
              )}
            </div>

            <ConfirmDialog
              open={confirmEdit}
              title="Confirm Edit"
              message="Do you want to edit this role ?"
              variant="success"
              confirmText="Edit"
              onCancel={() => setConfirmEdit(false)}
              onConfirm={() => {
                setConfirmEdit(false);
                setEditingRole(true);
                setPendingRole(role);
              }}
            />

            {!editingRole ? (
              <span className="label_admin">{role}</span>
            ) : (
              <select
                className="select select-sm select-ghost pl-1 text-[16px] outline-[#243c5a]/10"
                value={pendingRole}
                onChange={(e) => {
                  setPendingRole(e.target.value);
                  setConfirmSave(true);
                }}
              >
                <option value="User" disabled={role === "User"}>User</option>
                <option value="Admin" disabled={role === "Admin"}>Admin</option>
              </select>
            )}

              <ConfirmDialog
                open={confirmSave}
                role={pendingRole}
                title="Save Changes"
                message = {
                        <>
                          Are you sure, you want to change role to <b>{pendingRole}</b> ?
                        </>
                      }
                variant="success"
                confirmText="Save"
                onCancel={() => {
                  setConfirmSave(false);
                  setEditingRole(false);
                  setPendingRole(role);
                }}
                onConfirm = {async () => {
                  await updateUserRole(profile.userId, pendingRole);

                  setRole(pendingRole);
                  onRoleUpdated?.(profile.userId, pendingRole);

                  setEditingRole(false);
                  setConfirmSave(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

export default Detail_popup;
