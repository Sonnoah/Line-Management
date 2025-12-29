"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";

export function liff_init() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        await liff.init({ liffId: "2008650824-im7pjpsM" });

        if (!liff.isLoggedIn()) {
          liff.login();
          return; 
        }

        const profile = await liff.getProfile();

        setProfile({
          userId: profile.userId,
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl,
        });
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
