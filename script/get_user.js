import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase_config";

export async function getUser(userId) {
  const snap = await getDoc(doc(db, "Users", userId));
  return snap.exists() ? snap.data() : null;
}
