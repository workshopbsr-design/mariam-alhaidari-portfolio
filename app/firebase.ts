// @ts-ignore
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ------------------------------------------------------------------
// هام جداً: قم باستبدال البيانات أدناه ببيانات مشروعك من Firebase Console
// IMPORTANT: Replace the config below with your own from Firebase Console
// ------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000"
};

// Initialize Firebase
// We wrap this in a try-catch to prevent the app from crashing if keys are missing
let app;
let db;

try {
    // Check if config is dummy
    if (firebaseConfig.apiKey === "REPLACE_WITH_YOUR_API_KEY") {
        console.warn("Firebase not configured. Using local storage mode.");
    } else {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        console.log("Firebase Connected Successfully");
    }
} catch (e) {
    console.error("Firebase Initialization Error:", e);
}

export { db };