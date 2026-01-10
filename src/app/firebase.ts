import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

/* ================= FIREBASE CONFIG ================= */

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/* ================= SAFE INIT ================= */

/**
 * نهيّئ Firebase فقط إذا كانت القيم موجودة
 * حتى لا ينهار الموقع في حال عدم وجود env variables
 */

let app;
let db = null;

try {
  if (
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  ) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("✅ Firebase connected");
  } else {
    console.warn("⚠️ Firebase env variables missing — running in local mode");
  }
} catch (error) {
  console.error("❌ Firebase init error:", error);
  db = null;
}

/* ================= EXPORT ================= */

export { db };
