import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase_config";

export async function getCompanyHolidays() {
  const snap = await getDocs(collection(db, "CompanyHolidays"));

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
