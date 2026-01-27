import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase_config";

export async function loadUser(profile) {
  const ref = doc(db, "Users", profile.userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      role: "User",
      requireCamera: true,
      createdAt: serverTimestamp(),
    });
    return { requireCamera: true };
  }

  return snap.data();
}
