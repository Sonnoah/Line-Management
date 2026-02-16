import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase_config";

export async function checkLeaveQuota(userId, year) {
  const startOfYear = Timestamp.fromDate(new Date(year, 0, 1));
  const endOfYear = Timestamp.fromDate(new Date(year, 11, 31, 23, 59, 59));

  const q = query(
    collection(db, "Request"),
    where("userId", "==", userId),
    where("status", "==", "approved"), 
    where("createdAt", ">=", startOfYear),
    where("createdAt", "<=", endOfYear)
  );

  const snap = await getDocs(q);

  let privatePayCount = 0;
  let annualCount = 0;

  snap.forEach((doc) => {
  const d = doc.data();
  const days = Number(d.total_day) || 0;

  if (d.type === "Private pay") {
    privatePayCount += days;
  }

  if (d.type === "Annual") {
    annualCount += days;
  }
});

  return {
    privatePayCount,
    annualCount,
  };
}
