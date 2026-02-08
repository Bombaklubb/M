import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase-konfiguration
// Du behöver skapa ett Firebase-projekt på https://console.firebase.google.com/
// och ersätta dessa värden med dina egna
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "ERSÄTT_MED_DIN_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ERSÄTT_MED_DIN_AUTH_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ERSÄTT_MED_DITT_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ERSÄTT_MED_DIN_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "ERSÄTT_MED_DIN_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "ERSÄTT_MED_DIN_APP_ID"
};

// Kontrollera om Firebase är konfigurerat
export function isFirebaseConfigured(): boolean {
  return !firebaseConfig.apiKey.includes('ERSÄTT');
}

// Initiera Firebase
const app = initializeApp(firebaseConfig);

// Initiera Firestore
export const db = getFirestore(app);

export default app;
