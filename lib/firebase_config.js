import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDT3IQtjwOSYz3mVIAXhfyQ8q1wBA_HJbE",
  authDomain: "pt-test-b0dc9.firebaseapp.com",
  projectId: "pt-test-b0dc9",
  storageBucket: "pt-test-b0dc9.firebasestorage.app",
  messagingSenderId: "1938984234",
  appId: "1:1938984234:web:5341535310f9da20c6a253",
  measurementId: "G-M3MT9GYH05"
};
const app = initializeApp(firebaseConfig);

if (typeof window !== "undefined") {
  getAnalytics(app);
}

export const db = getFirestore(app);
