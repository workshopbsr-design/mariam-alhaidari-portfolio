import * as firebaseApp from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Explicitly extract modular functions from the app namespace to resolve potential named export resolution issues in the environment
const { initializeApp, getApp, getApps } = firebaseApp as any;

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

let db: any = null;

try {
  // Ensure the configuration is valid before attempting initialization
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined") {
    // Check if a Firebase app instance already exists to avoid duplication in hot-reloading environments
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
} catch (e) {
  console.error("Firebase Initialization Failed:", e);
}

export { db };
