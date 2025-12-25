"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { db } from "./firebase_config";
import { collection, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";


async function main() {
  await liff.init({ liffId: "2008650824-im7pjpsM" });
  if (liff.isLoggedIn()) {
    const profile = await liff.getProfile();
    document.getElementById("userId").value = profile.userId;
  } else {
    liff.login();
  }
}
main();

export async function saveToFirestore() {
  const form = document.getElementById("Form");

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = {
    userId: document.getElementById("userId").value,
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

