import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase_config";

export async function getAllUsers() {
  const q = query(
    collection(db, "Users"),
    orderBy("department", "asc"),
    orderBy("displayName", "asc")
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => {
    const data = doc.data();

    return {
      id: doc.id,
      ...data,

      name: data.username?.trim() || data.displayName,
    };
  });
}
