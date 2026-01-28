import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase_config";

export async function getLeaveQuota(userId, year) {
  const ref = doc(db, "LeaveQuota", `${userId}_${year}`);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return {
      privatePay: 0,
      annual: 0,
    };
  }

  const data = snap.data();
  return {
    privatePay: data.privatePayUsed || 0,
    annual: data.annualUsed || 0,
  };
}
