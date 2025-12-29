import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase_config";

export async function getUser(userId) {
  const snap = await getDoc(doc(db, "users", userId));
  return snap.exists() ? snap.data() : null;
}
