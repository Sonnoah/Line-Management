import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC1qq59U0moH20dOCpAITNFR9ttHLxTRFg",
  authDomain: "pt-test-b0dc9.firebaseapp.com",
  projectId: "pt-test-b0dc9",
  storageBucket: "pt-test-b0dc9.firebasestorage.app",
  messagingSenderId: "1938984234",
  appId: "1:1938984234:web:89078e2d16c3958cc6a253",
  measurementId: "G-F2KV6LY4XE"
};
const app = initializeApp(firebaseConfig);
if (typeof window !== "undefined") {
  getAnalytics(app);
}

export const db = getFirestore(app);
