"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { get_liff_Profile } from "@/helper/liff_get_profile";
import { getUser } from "@/script/get_user";
import { Loading } from "@/app/components/loading";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    async function checkAdmin() {
      const profile = await get_liff_Profile();

      if (!profile?.userId) {
        router.replace("/main");
        return;
      }

      const user = await getUser(profile.userId);

      if (!user || user.role !== "Admin") {
        router.replace("/");
      } else {
        setAuthorized(true);
      }
    }

    checkAdmin();
  }, []);

  if (authorized === null) return <Loading />;

  return children;
}
