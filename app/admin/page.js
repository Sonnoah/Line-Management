"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { get_liff_Profile } from "@/helper/liff_get_profile";
import { getUser } from "@/script/get_user";
import { Loading } from "@/app/components/loading";
import AdminPanel from "../components/pages/admin_panel";

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkRole() {
      const profile = await get_liff_Profile();
      if (!profile) return;

      const dbUser = await getUser(profile.userId);

      if (dbUser?.role !== "Admin") {
        router.replace("/"); 
        return;
      }

      setAllowed(true);
      setChecking(false);
    }

    checkRole();
  }, []);

  if (checking) return <Loading />;

  if (!allowed) return null;

  return <AdminPanel />;
}
