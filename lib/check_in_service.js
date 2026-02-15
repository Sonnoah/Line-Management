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


export async function checkIn(userId, date, geo, photo, department) {

  const ref = await addDoc(collection(db, "Checkins"), {
    userId,
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

export async function adminEditCheckin(
  checkinId,
  checkInTime,
  checkOutTime
) {
  const ref = doc(db, "Checkins", checkinId);

  const [inH, inM] = checkInTime.split(":").map(Number);
  const [outH, outM] = checkOutTime.split(":").map(Number);

  const now = new Date();

  const newCheckIn = new Date(now);
  newCheckIn.setHours(inH, inM, 0, 0);

  const newCheckOut = new Date(now);
  newCheckOut.setHours(outH, outM, 0, 0);

  await updateDoc(ref, {
    checkInAt: newCheckIn,
    checkOutAt: newCheckOut,
    editedByAdmin: true,
    editedAt: new Date(),
  });
}
