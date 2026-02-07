import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase_config";

export async function getCheckinsForCurrentPeriod(period) {
  if (!period?.startDate || !period?.endDate) {
    throw new Error("Invalid payroll period");
  }

  const start = period.startDate.toISOString().slice(0, 10);
  const end = period.endDate.toISOString().slice(0, 10);

  const q = query(
    collection(db, "Checkins"),
    where("date", ">=", start),
    where("date", "<=", end),
    orderBy("date", "asc")
  );

  const snap = await getDocs(q);

  return snap.docs.map(d => ({
    id: d.id,
    ...d.data(),
  }));
}
