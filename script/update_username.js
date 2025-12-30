import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase_config";

export async function update_username(userId, username) {
  const value = username.trim();

  if (value.length <= 2) {
    throw new Error("Must be more than 2 characters.");
  }

  await updateDoc(doc(db, "Users", userId), {
    username: value,
    updatedAt: serverTimestamp(),
  });
}
