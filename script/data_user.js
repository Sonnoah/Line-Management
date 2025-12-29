import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function saveUser(profile) {
  await setDoc(
    doc(db, "users", profile.userId),
    {
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      role: "user", 
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}
