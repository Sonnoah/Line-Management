import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase_config";

export async function updateUserDepartment(userId, department) {
  if (!userId || !department) return;

  await updateDoc(doc(db, "Users", userId), {
    department,
    updatedAt: serverTimestamp(),
  });
}
