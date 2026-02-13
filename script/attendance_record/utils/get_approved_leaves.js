import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase_config";

export async function getApprovedRequests() {
  const q = query(collection(db, "Request"));
  const snap = await getDocs(q);

  return snap.docs.map(d => ({
    id: d.id,
    ...d.data(),
  }));
}
