import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase_config";

export async function saveUser(profile) {
  const ref = doc(db, "users", profile.userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {

    await setDoc(ref, {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      role: "user",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {

    await setDoc(
      ref,
      {
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
}
