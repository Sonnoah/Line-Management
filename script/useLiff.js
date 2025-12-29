"use client";

import { useEffect, useRef, useState } from "react";
import liff from "@line/liff";
import { saveUser } from "@/lib/saveuser";

export function useLiff() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const savedRef = useRef(false); 

  useEffect(() => {
    async function init() {
      try {
        await liff.init({ liffId: "2008650824-im7pjpsM" });

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

        if (!savedRef.current) {
          await saveUser(userProfile);
          savedRef.current = true;
        }

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
