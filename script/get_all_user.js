import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase_config";

export async function getAllUsers() {
  const snap = await getDocs(collection(db, "Users"));

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}