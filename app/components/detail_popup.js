"use client";

import { forwardRef, useEffect, useState } from "react";
import { updateUserRole } from "@/script/update_user_role"
import { updateUserDepartment } from "@/script/update_user_department";;
import ConfirmDialog from "./confirm_dialog";

const Detail_popup = forwardRef(
  ({ profile, onRoleUpdated, onDepartmentUpdated }, ref) => {


  const [editingRole, setEditingRole] = useState(false);
  const [role, setRole] = useState("");
  const [pendingRole, setPendingRole] = useState(""); 
  const [confirmEdit, setConfirmEdit] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);

  const [editingDept, setEditingDept] = useState(false);
  const [department, setDepartment] = useState("");
  const [pendingDept, setPendingDept] = useState("");

  const [confirmEditDept, setConfirmEditDept] = useState(false);
  const [confirmSaveDept, setConfirmSaveDept] = useState(false);

  const isFirstSetDept = !department; 

  useEffect(() => {
    if (profile) {
      setRole(profile.role || "");
      setEditingRole(false);
    }
  }, [profile]);

  useEffect(() => {
  if (profile) {
    setRole(profile.role || "");
    setDepartment(profile.department || "");
    setEditingRole(false);
    setEditingDept(false);
  }
}, [profile]);


  function resetAll() {
    setEditingRole(false);
    setEditingDept(false);

    setConfirmEdit(false);
    setConfirmSave(false);
    setConfirmEditDept(false);
    setConfirmSaveDept(false);

    setPendingRole("");
    setPendingDept("");

    setRole(profile?.role || "");
    setDepartment(profile?.department || "");
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
              <p className="label_admin_title opacity-50">Department</p>

              {!editingDept && (
                <button
                  type="button"
                  onClick={() => setConfirmEditDept(true)}
                  className="profile_icon ml-2"
                >
                  <span className="cuida--edit-outline" />
                </button>
              )}
            </div>

            <ConfirmDialog
              open={confirmEditDept}
              title="Confirm Edit"
              message="Do you want to edit this department?"
              variant="success"
              confirmText="Edit"
              onCancel={() => setConfirmEditDept(false)}
              onConfirm={() => {
                setConfirmEditDept(false);
                setEditingDept(true);
                setPendingDept(department || "");

              }}
            />

            {!editingDept ? (
              <span className="label_admin">{department || "-"}</span>
            ) : (
            <select className="select select-sm select-ghost pl-1 text-[16px] outline-[#243c5a]/10"
              value={pendingDept}
              onChange={(e) => {
                setPendingDept(e.target.value);
                setConfirmSaveDept(true);
              }}
            >
              <option value="" disabled hidden> Select department</option>
              <option value="Production" disabled={!isFirstSetDept && department === "Production"}> Production </option>
              <option value="Office" disabled={!isFirstSetDept && department === "Office"}>Office</option>
            </select>

            )}

            <ConfirmDialog
              open={confirmSaveDept}
              title="Save Changes"
              message={
                <>
                  Are you sure you want to change department to{" "}
                  <b>{pendingDept}</b>?
                </>
              }
              variant="success"
              confirmText="Save"
              onCancel={() => {
                setConfirmSaveDept(false);
                setEditingDept(false);
                setPendingDept(department);
              }}
              onConfirm={async () => {
                await updateUserDepartment(profile.userId, pendingDept);

                setDepartment(pendingDept);
                onDepartmentUpdated?.(profile.userId, pendingDept);
                setEditingDept(false);
                setConfirmSaveDept(false);
              }}
            />
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
