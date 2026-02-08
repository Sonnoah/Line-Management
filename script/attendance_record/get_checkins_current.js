import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase_config";
import { dateToYMD } from "@/script/attendance_record/utils/format_thai_date";

export async function getCheckinsForCurrentPeriod(period) {
  const start = dateToYMD(period.startDate);
  const end = dateToYMD(period.endDate); 

  console.log("[QUERY RANGE]", start, "→", end);

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
