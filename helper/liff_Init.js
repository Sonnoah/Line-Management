"use client";

import liff from "@line/liff";
import { useEffect, useState } from "react";
import { saveUser } from "@/lib/saveuser";

export function liff_init() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        await liff.init({ liffId: "2009004348-Yg6fhO0l" });

        if (!liff.isLoggedIn()) {
          liff.login();
          return; 
        }

         const profile = await liff.getProfile();

        const userProfile = {
          userId: profile.userId,
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl,
        };

        await saveUser(userProfile);

        setProfile(userProfile);
      } catch (err) {
        console.error("LIFF error:", err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  return { profile, loading };
}
