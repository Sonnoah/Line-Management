import liff from "@line/liff";

export async function get_liff_Profile() {
  
  await liff.init({ liffId: "2008650824-im7pjpsM" });

  if (!liff.isLoggedIn()) {
    liff.login();
    return;
  }

  const profile = await liff.getProfile();

  return {
    userId: profile.userId,
    pictureUrl: profile.pictureUrl,
    displayName: profile.displayName,
  };
}

export async function load_profile(setProfile) {
  const data = await get_liff_Profile();
  setProfile(data);
}