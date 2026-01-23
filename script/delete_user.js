import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase_config";

export async function deleteUser(userId) {
  const ref = doc(db, "Users", userId);
  await deleteDoc(ref);
}
