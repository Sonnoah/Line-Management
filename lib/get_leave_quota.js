import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase_config";

export function calculateDays(start, end) {
  if (!start || !end) return 0;

  const startDate = new Date(start);
  const endDate = new Date(end);

  const diffTime = endDate - startDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays + 1;
}

export async function getLeaveQuota(userId, year) {
  const startOfYear = `${year}-01-01`;
  const endOfYear = `${year}-12-31`;

  const q = query(
    collection(db, "Request"),
    where("userId", "==", userId),
    where("status", "==", "approved"),
    where("start_date", ">=", startOfYear),
    where("start_date", "<=", endOfYear)
  );

  const snap = await getDocs(q);

  let privatePay = 0;
  let annual = 0;

  snap.forEach((doc) => {
    const d = doc.data();
    const days = calculateDays(d.start_date, d.end_date);

    if (d.type === "Private pay") privatePay += days;
    if (d.type === "Annual") annual += days;
  });

  return { privatePay, annual };
}
