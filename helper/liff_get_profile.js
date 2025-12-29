import liff from "@line/liff";
import { getUser } from "@/lib/get_user";
import { saveUser } from "@/lib/saveuser";

export async function load_profile(setProfile) {
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


  await saveUser(baseProfile);

  const dbUser = await getUser(baseProfile.userId);

  setProfile({
    ...baseProfile,
    username: dbUser?.username ?? null,
    role: dbUser?.role ?? "user",
  });
}
