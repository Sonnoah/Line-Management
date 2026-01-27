"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { get_liff_Profile } from "@/helper/liff_get_profile";
import { getUser } from "@/script/get_user";

export default function Nav() {

  const [role, setRole] = useState(null); 

  useEffect(() => {
    async function loadRole() {
      const profile = await get_liff_Profile();
      if (!profile) return;

      const dbUser = await getUser(profile.userId);
      setRole(dbUser?.role || "User");
    }

    loadRole();
  }, []);

  return (
    <div className="navbar fixed top-0 left-0 w-full z-50">
      <div className="navbar-end w-full">

        <div className="dropdown dropdown-end">
           <div tabIndex={0} role="button" className="btn btn-circle btn-ghost group relative flex items-center justify-center "
              onClick={() => {
              document.activeElement?.blur();
            }}>
             <span className="absolute heroicons-solid--menu-alt-3 text-2xl transition-all duration-300 ease-in-out opacity-100 scale-100 rotate-0 group-focus:opacity-0 group-focus:scale-100  group-focus:rotate-90"></span>
             <span className="absolute line-md--menu-to-close-alt-transition text-2xl transition-all duration-300 ease-in-out opacity-0 scale-75 rotate--90 group-focus:opacity-100 group-focus:scale-100   group-focus:rotate-0"></span>
          </div> 
          <ul tabIndex={-1} 
            className="menu menu-md dropdown-content bg-base-100 rounded-box mt-0 w-60 p-5 shadow-sm" 
            onClick={() => document.activeElement?.blur()}>
              <li><Link href="/"><span className="iconamoon--home"></span><p className=" text-[16px]">Home</p></Link></li> 
              <li><Link href="/profile"><span class="mage--scan-user"></span><p className=" text-[16px]">Profile</p></Link></li>
              <li><Link href="/check_in"><span className="akar-icons--check-in"></span><p className=" text-[16px]">Check In</p></Link></li>
              <li><a className="pointer-events-none opacity-50">
                <span className="oui--nav-reports"></span><p className=" text-[16px]">Request</p></a> 
                  <ul>
                    <li><Link href="/request_for_leave"><p className=" text-[16px]">Request For Leave</p></Link></li> 
                  </ul> 
                </li>

              {role === "Admin" && (
                 <li><a className="pointer-events-none opacity-50">
                  <span className="solar--user-id-broken"></span><p className=" text-[16px]">Admit Panel</p></a> 
                  <ul>
                     <li><Link href="/admin"><p className=" text-[16px]">Users List</p></Link></li>
                  </ul> 
                </li>
                )
              }
          </ul>
        </div>
      </div>
    </div>
  );
}
