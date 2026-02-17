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
import { Timestamp } from "firebase/firestore";

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
  checkOutTime,
  dateStr
) {
  const ref = doc(db, "Checkins", checkinId);

  const [year, month, day] = dateStr.split("-").map(Number);
  const [inH, inM] = checkInTime.split(":").map(Number);
  const [outH, outM] = checkOutTime.split(":").map(Number);

  // สร้างวันที่แบบ Bangkok โดยตรง
  const checkInDate = new Date(Date.UTC(year, month - 1, day, inH - 7, inM));
  const checkOutDate = new Date(Date.UTC(year, month - 1, day, outH - 7, outM));

  await updateDoc(ref, {
    checkInAt: Timestamp.fromDate(checkInDate),
    checkOutAt: Timestamp.fromDate(checkOutDate),
    editedByAdmin: true,
    editedAt: Timestamp.now(),
  });
}