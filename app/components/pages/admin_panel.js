"use client";

import { useRef, useEffect, useState } from "react";
import { getAllUsers } from "@/script/get_all_user";
import { Loading } from "@/app/components/loading";
import { deleteUser } from "@/script/delete_user";
import Detail_popup from "../detail_popup";
import ConfirmDialog from "../confirm_dialog";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); 
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const dialogRef = useRef(null);
  
  function openDetail(profile) {
    setSelectedUser(profile);
    setTimeout(() => {
      dialogRef.current?.showModal();
    }, 0);
  }

  function handleRoleUpdated(userId, newRole) {
  setUsers(prev =>
    prev.map(u =>
      u.userId === userId ? { ...u, role: newRole } : u
    )
  );

  setSelectedUser(prev =>
    prev ? { ...prev, role: newRole } : prev
  );
}

  function handleDepartmentUpdated(userId, newDepartment) {
    setUsers(prev =>
      prev.map(u =>
        u.userId === userId ? { ...u, department: newDepartment } : u
      )
    );

    setSelectedUser(prev =>
      prev ? { ...prev, department: newDepartment } : prev
    );
  }

  useEffect(() => {
    async function load() {
      const data = await getAllUsers();
      setUsers(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <Loading />;
  
  return (
    <div className="wrap">
      <main className="admin-container">
        <table className="table">
          <thead>
            <tr>
              <th className="pl-0 pr-0">Name</th>
              <th className="pl-1 pr-0">Dept.</th>
              <th className="pl-1 pr-0">Role</th>
              <th className="pl-1 pr-0"></th>
            </tr>
          </thead>

          <tbody>
            {users.map(profile => (
              <tr key={profile.userId}>
                <td className="pl-0 pr-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={profile.pictureUrl}
                      className="h-10 w-10 mask mask-squircle"
                    />
                    <div>
                      <div className="font-bold text-[12px]">
                        {profile.displayName}
                      </div>
                      <div className="text-sm opacity-50 text-[10px]">
                        {profile.username}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="pl-1 pr-0">
                  <div className="text-[14px]">{profile.department}</div>
                </td>

           <td className="pl-1 pr-0">
            <div
              className={`text-[14px] px-2 py-1 rounded ${
                profile.role === "Admin"
                  ? "badge badge-soft badge-info rounded-full"
                  : "badge badge-soft opacity-50 rounded-full"
              }`}
            >
              {profile.role}
            </div>
          </td>

                <td className="pl-1 pr-0">
                  <div className="dropdown dropdown-bottom dropdown-end">
                    <div tabIndex="0" role="button" className="btn btn-ghost btn-xs">
                      <span className="solar--menu-dots-bold"></span>
                    </div>
                    <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 p-2 w-40  shadow-sm">
                      <li onClick={() => openDetail(profile)}>
                        <a className="text-[16px]">
                          <span className="clarity--details-line"></span>
                          Detail
                        </a>
                      </li>

                      <li  onClick={() => {
                            setUserToDelete(profile);
                            setConfirmDelete(true);
                          }}>
                        <a className="text-[#ea0000] text-[16px]">
                          <span className="solar--trash-bin-minimalistic-broken"></span>
                          Delete
                        </a>
                      </li>

                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Detail_popup
          ref={dialogRef}
          profile={selectedUser}
          onRoleUpdated={handleRoleUpdated}
          onDepartmentUpdated={handleDepartmentUpdated}
        />


       {confirmDelete && userToDelete && (
          <ConfirmDialog
            open={confirmDelete}
            title="Delete User"
            message={
              <>
                <p>Are you sure, You want to delete {" "} ?
                <b>{userToDelete.displayName}</b></p>
                <p className="text-sm opacity-60 mt-1">
                  This action cannot be undone.
                </p>
              </>
            }
            variant="error"
            confirmText="Delete"
            onCancel={() => {
              setConfirmDelete(false);
              setUserToDelete(null);
            }}
            onConfirm={async () => {
              await deleteUser(userToDelete.userId);

              setUsers(prev =>
                prev.filter(u => u.userId !== userToDelete.userId)
              );

              setConfirmDelete(false);
              setUserToDelete(null);
            }}
          />
        )}
      </main>
    </div>
  );
}
