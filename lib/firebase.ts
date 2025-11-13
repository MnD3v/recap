import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCZa8DCdgxTtCVg0EtkpgiKjyyBRt8M6qU",
  authDomain: "recap-99ba0.firebaseapp.com",
  projectId: "recap-99ba0",
  storageBucket: "recap-99ba0.firebasestorage.app",
  messagingSenderId: "810194460182",
  appId: "1:810194460182:web:fa822a9256d2671e739f37",
  measurementId: "G-MNEY8HQPVK",
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

let analytics: Analytics | null = null;

export const initAnalytics = async () => {
  if (analytics || typeof window === "undefined") return analytics;

  try {
    const supported = await isSupported();
    if (supported) {
      analytics = getAnalytics(app);
    }
  } catch (error) {
    console.warn("Unable to initialize Firebase Analytics", error);
  }

  return analytics;
};

export { app, auth, db };

