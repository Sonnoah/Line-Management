import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase_config";

export async function getCheckinsByPeriod(period) {
  const q = query(
    collection(db, "Checkins"),
    where("date", ">=", period.start),
    where("date", "<=", period.end),
    orderBy("date", "asc")
  );

  const snap = await getDocs(q);

  return snap.docs.map(d => ({
    id: d.id,
    ...d.data(),
  }));
}


