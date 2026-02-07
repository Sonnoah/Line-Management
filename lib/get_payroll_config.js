import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase_config";

export async function getPayrollConfig() {
  const ref = doc(db, "Config", "payroll");
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return {
      active10to25: null,
      active26to09: null,
    };
  }

  return snap.data();
}
