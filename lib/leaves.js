import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase_config";

export async function getApprovedRequest() {
  const q = query(
    collection(db, "Request"),
    where("status", "==", "approved")
  );

  const snap = await getDocs(q);

  return snap.docs.map(d => ({
    id: d.id,
    ...d.data(),
  }));
}
