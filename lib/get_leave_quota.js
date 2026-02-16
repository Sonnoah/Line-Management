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
  const q = query(
    collection(db, "Request"),
    where("userId", "==", userId),
    where("status", "==", "approved")
  );

  const snap = await getDocs(q);

  let privatePay = 0;
  let annual = 0;

  snap.forEach((doc) => {
    const d = doc.data();

    const leaveYear = new Date(d.start_date).getFullYear();
    if (leaveYear !== year) return;

    const days = calculateDays(d.start_date, d.end_date);

    if (d.type === "Private pay") privatePay += days;
    if (d.type === "Annual") annual += days;
  });

  return {
    privatePay,
    annual,
  };
}
