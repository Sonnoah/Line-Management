"use client";

import { useEffect, useState } from "react";
import { get_liff_Profile } from "@/helper/liff_get_profile";
import { Loading } from "@/app/components/loading";
import { getLeaveQuota } from "@/lib/get_leave_quota";
import EditUsername from "@/app/components/edit_username";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [showUserId, setShowUserId] = useState(false);
  const [quota, setQuota] = useState({
    privatePay: 0,
    annual: 0,
  });
  const [loading, setLoading] = useState(true);

  function handleUsernameUpdated(newUsername) {
  setProfile(prev => ({
      ...prev,
      username: newUsername,
    }));
  }

  useEffect(() => {
    async function load() {
      const data = await get_liff_Profile();
      if (!data?.userId) return;

      setProfile(data);

      const year = new Date().getFullYear();
      const result = await getLeaveQuota(data.userId, year);

      setQuota(result);
      setLoading(false);
    }

    load();
  }, []);

  if (loading || !profile) return <Loading />;

  function QuotaRow({ title, used, total, icon, color = "text-primary",}) {
    return (
        <div className="stat p-3">
          <div className={`stat-figure ${color}`}>
            {icon}
          </div>

          <div className="stat-title">{title}</div>

          <div className={`stat-value text-[18px]`}>
            {used} / {total}
          </div>

          <div className="stat-desc">Count</div>
        </div>
    );
  }


  return (
    <div className="wrap">
      <main className="profile-container">
          <img src={profile.pictureUrl} alt="profile"
            className="w-38 h-38 mt-5 rounded-full"
          />

          <div className="divider mt-5 w-full uppercase text-[14px]"> Profile </div>

            <div className="flex gap-1 w-full">
              <div className="stats shadow flex-1">
                <QuotaRow
                  title="Private pay"
                  used={quota.privatePay}
                  total={4}
                  color="text-info"
                  icon={<span className="lucide--tent-tree"></span>}
                />
              </div>

              <div className="stats shadow flex-1">
                <QuotaRow
                  title="Annual"
                  used={quota.annual}
                  total={6}
                  color="text-info"
                  icon={<span className="hugeicons--bitcoin-piggy-bank"></span>}
                />
              </div>
            </div>

    
          
          <div className="userid-row mt-5">
           <label className="label_profile_title opacity-50">User ID</label>
            <button
              type="button"
              className="profile_icon ml-2"
              onClick={() => setShowUserId(!showUserId)}
            >
              {showUserId ? <span className="radix-icons--eye-none"></span> 
              : <span className="radix-icons--eye-open"></span>}
            </button>
          </div>
        
        <span className="label_profile break-all">
            {showUserId ? profile.userId : "************"}
        </span>
        
        <label className="label_profile">
          <EditUsername
            userId={profile.userId}
            currentUsername={profile.username}
            onUsernameUpdated={handleUsernameUpdated}
          />
        </label>

        <label className="label_profile_title opacity-50">Display Name</label>
        <label className="label_profile">{profile.displayName}</label>

        
        <label className="label_profile_title opacity-50">Department</label>
        <label className="label_profile">{profile.department}</label>

        <label className="label_profile_title opacity-50">Role</label>
        <label className="label_profile">{profile.role}</label>
 
      </main>
    </div>
    
  );
}
