import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp
} from "firebase/firestore";
import { db } from "../lib/firebase_config";

export async function getTodayCheckin(userId, date) {
  const ref = doc(db, "checkins", `${userId}_${date}`);
  const snap = await getDoc(ref);
  return snap;
}

export async function checkIn(userId, date, geo) {
  const ref = doc(db, "checkins", `${userId}_${date}`);
  await setDoc(ref, {
    userId,
    date,
    geoIn: geo,
    timeIn: Timestamp.now(),
    createdAt: Timestamp.now()
  });
}

export async function checkOut(userId, date, geo) {
  const ref = doc(db, "checkins", `${userId}_${date}`);
  await updateDoc(ref, {
    geoOut: geo,
    timeOut: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
}
