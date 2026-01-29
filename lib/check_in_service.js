import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase_config";


export async function getTodayCheckin(userId, date) {
  const q = query(
    collection(db, "Checkins"),
    where("userId", "==", userId),
    where("date", "==", date),
    orderBy("createdAt", "desc"),
    limit(1)
  );

  const snap = await getDocs(q);
  return snap.empty ? null : snap.docs[0];
}


export async function checkIn(userId, photo, date, geo, department) {
  const ref = await addDoc(collection(db, "Checkins"), {
    userId,
    photo,
    date,
    department,

    checkInAt: serverTimestamp(),
    checkInGeo: geo,
    checkInPhoto: photo,

    status: "IN",
    createdAt: serverTimestamp(),
  });

  return ref.id;
}


export async function checkOut(checkinId, geo, photo, department) {
  const ref = doc(db, "Checkins", checkinId);

  await updateDoc(ref, {
    checkOutAt: serverTimestamp(),
    checkOutGeo: geo,
    checkOutPhoto: photo,
    department,

    status: "OUT", 
    updatedAt: serverTimestamp(),
  });
}
