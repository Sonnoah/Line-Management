import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getUserRole(userId) {
  const snap = await getDoc(doc(db, "users", userId));
  return snap.exists() ? snap.data().role : null;
}

