"use client";

import { useEffect, useState } from "react";
import { get_liff_Profile } from "@/helper/liff_get_profile";
import { Loading } from "@/helper/loading";
import EditUsername from "@/app/component/edit_username";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [showUserId, setShowUserId] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await get_liff_Profile();
      if (data) {
        setProfile(data);
      }
    }
    load();
  }, []);

  if (!profile) return <Loading />;

  return (
    <div className="wrap">
      <main className="profile-container">
          <img src={profile.pictureUrl} alt="profile"
            className="w-38 h-38 mt-30 rounded-full"
          />

        <div className="divider mt-5 w-full uppercase text-[14px]"> Profile </div>


          <div className="userid-row">
           <label className="label_profile_title ">User ID</label>
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
          />
        </label>

        <label className="label_profile_title ">Display Name</label>
        <label className="label_profile">{profile.displayName}</label>

        <label className="label_profile_title ">Role</label>
        <label className="label_profile"></label>

                   
      </main>
    </div>
  );
}
