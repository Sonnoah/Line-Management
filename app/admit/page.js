"use client";

import { useRef, useEffect, useState } from "react";
import { getAllUsers } from "@/script/get_all_user";
import { Loading } from "@/helper/loading";
import Actions_popup from "../component/actions_popup";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); 
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
              <th>Name</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {users.map(profile => (
              <tr key={profile.userId}>
                <td>
                  <div className="flex items-center gap-3">
                    <img
                      src={profile.pictureUrl}
                      className="h-10 w-10 mask mask-squircle"
                    />
                    <div>
                      <div className="font-bold text-[14px]">
                        {profile.displayName}
                      </div>
                      <div className="text-sm opacity-50 text-[12px]">
                        {profile.username}
                      </div>
                    </div>
                  </div>
                </td>

                <td>
                  <div className="text-[14px]">{profile.role}</div>
                </td>

                <td>
                 <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => openDetail(profile)}>
                  Detail
                </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Actions_popup
          ref={dialogRef}
          profile={selectedUser}
          onRoleUpdated={handleRoleUpdated}
        />
      </main>
    </div>
  );
}
