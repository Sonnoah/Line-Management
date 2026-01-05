import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase_config";

export async function updateUserRole(userId, role) {
  await updateDoc(doc(db, "Users", userId), {
    role,
    updatedAt: serverTimestamp(),
  });
}
