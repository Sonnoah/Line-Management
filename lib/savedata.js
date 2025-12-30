"use client";

import { db } from "./firebase_config";
import { collection, addDoc } from "firebase/firestore";
import { get_liff_Profile } from "../helper/liff_get_profile";
import Swal from "sweetalert2";

export async function saveToFirestore(formData) {
  if (!formData) return false;

  const profile = await get_liff_Profile();

  const data = {
    userId: profile.userId,
    name: formData.name,
    type: formData.type,
    start_date: formData.start_date,
    end_date: formData.end_date,
    total_day: formData.total_day,
    note: formData.note,
    timestamp: new Date(),
  };

  try {
    await addDoc(collection(db, "request"), data);

    Swal.fire({
      icon: "success",
      title: "ส่งคำขอสำเร็จ",
      text: "ระบบบันทึกข้อมูลเรียบร้อยแล้ว",
      timer: 1500,
      showConfirmButton: false,
    });

    return true; 
  } catch (e) {
    console.error(e);

    Swal.fire({
      icon: "error",
      title: "ส่งคำขอไม่สำเร็จ",
      text: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
    });

    return false;
  }
}
