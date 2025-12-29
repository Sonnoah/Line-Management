"use client";

import { db } from "./firebase_config";
import { collection, addDoc } from "firebase/firestore";
import { get_liff_Profile } from "../helper/liff_get_profile";
import Swal from "sweetalert2";

export async function saveToFirestore() {

  const profile = await get_liff_Profile();

  const form = document.getElementById("Form");

  const data = {
    userId: profile.userId,        
    name: document.getElementById("name").value,
    type: document.getElementById("type").value,
    start_date: document.getElementById("start_date").value,
    end_date: document.getElementById("end_date").value,
    total_day: document.getElementById("total_day").value,
    note: document.getElementById("note").value,
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

    form.reset();

  } catch (e) {
    console.error(e);

    Swal.fire({
      icon: "error",
      title: "ส่งคำขอไม่สำเร็จ",
      text: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
    });
  }
}
