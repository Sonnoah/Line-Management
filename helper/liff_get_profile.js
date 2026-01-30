"use client";

import liff from "@line/liff";
import { getUser } from "@/script/get_user";
import { saveUser } from "@/lib/saveuser";

export async function get_liff_Profile() {
  await liff.init({ liffId: "2009004348-Yg6fhO0l" });

  if (!liff.isLoggedIn()) {
    liff.login();
    return null;
  }

  const liffProfile = await liff.getProfile();

  const baseProfile = {
    userId: liffProfile.userId,
    displayName: liffProfile.displayName,
    pictureUrl: liffProfile.pictureUrl,
  };

  await saveUser(baseProfile);

  const dbUser = await getUser(baseProfile.userId);

  return {
    ...baseProfile,
    username: dbUser?.username ?? null,
    role: dbUser?.role ?? "user",
    department: dbUser?.department ?? null,
  };
}
