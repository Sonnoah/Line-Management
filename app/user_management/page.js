"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { get_liff_Profile } from "@/helper/liff_get_profile";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase_config";
import { Loading } from "@/app/components/loading";
import AdminPanel from "../components/pages/admin_panel";
import AdminGuard from "@/app/components/admin_guard";

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let unsubscribe;

    async function checkRoleRealtime() {
      const profile = await get_liff_Profile();
      if (!profile) return;

      const userRef = doc(db, "Users", profile.userId);

      unsubscribe = onSnapshot(userRef, (snap) => {
        const dbUser = snap.data();

        if (!dbUser || dbUser.role !== "Admin") {
          setAllowed(false);
          router.replace("/main");
        } else {
          setAllowed(true);
        }

        setChecking(false);
      });
    }

    checkRoleRealtime();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (checking) return <Loading />;
  if (!allowed) return null;

  return (
    <AdminGuard>
      <AdminPanel />
    </AdminGuard>
  );
}
