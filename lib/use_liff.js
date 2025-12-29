"use client";

import { useEffect, useRef, useState } from "react";
import liff from "@line/liff";
import { saveUser } from "./saveuser";
import { getUser } from "./get_user";

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

        const liffProfile = await liff.getProfile();

        const baseProfile = {
          userId: liffProfile.userId,
          displayName: liffProfile.displayName,
          pictureUrl: liffProfile.pictureUrl,
        };

        if (!savedRef.current) {
          await saveUser(baseProfile);
          savedRef.current = true;
        }

        const dbUser = await getUser(baseProfile.userId);

        setProfile({
          ...baseProfile,
          username: dbUser?.username ?? null,
          role: dbUser?.role ?? "user",
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
