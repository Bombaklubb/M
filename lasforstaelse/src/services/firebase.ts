import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { User } from '../types';

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

// Generera ett unikt ID baserat på användarnamn
function getUserId(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, '_');
}

/**
 * Spara användare till Firebase
 */
export async function saveUserToCloud(user: User): Promise<void> {
  if (!isFirebaseConfigured()) return;

  try {
    const userId = getUserId(user.name);
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...user,
      updatedAt: Timestamp.now()
    }, { merge: true });
  } catch (error) {
    console.error('Kunde inte spara användare till molnet:', error);
  }
}

/**
 * Hämta en användare från Firebase baserat på namn
 */
export async function getUserFromCloud(name: string): Promise<User | null> {
  if (!isFirebaseConfigured()) return null;

  try {
    const userId = getUserId(name);
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      // Ta bort Firestore-specifika fält
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { updatedAt, ...userData } = data;
      return userData as User;
    }
  } catch (error) {
    console.error('Kunde inte hämta användare från molnet:', error);
  }
  return null;
}

/**
 * Hämta alla användare från Firebase (för lärarstatistik)
 */
export async function getAllUsersFromCloud(): Promise<User[]> {
  if (!isFirebaseConfigured()) return [];

  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('totalPoints', 'desc'), limit(100));
    const querySnapshot = await getDocs(q);

    const users: User[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Ta bort Firestore-specifika fält
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { updatedAt, ...userData } = data;
      users.push(userData as User);
    });

    return users;
  } catch (error) {
    console.error('Kunde inte hämta användare från molnet:', error);
    return [];
  }
}

interface DailyStats {
  date: string;
  textsRead: number;
  genres: Record<string, number>;
  themes: Record<string, number>;
  grades: Record<number, number>;
}

/**
 * Spara daglig statistik till Firebase
 */
export async function saveDailyStatsToCloud(stats: DailyStats): Promise<void> {
  if (!isFirebaseConfigured()) return;

  try {
    const statsRef = doc(db, 'dailyStats', stats.date);
    await setDoc(statsRef, {
      ...stats,
      updatedAt: Timestamp.now()
    }, { merge: true });
  } catch (error) {
    console.error('Kunde inte spara daglig statistik till molnet:', error);
  }
}

/**
 * Hämta daglig statistik från Firebase
 */
export async function getDailyStatsFromCloud(date: string): Promise<DailyStats | null> {
  if (!isFirebaseConfigured()) return null;

  try {
    const statsRef = doc(db, 'dailyStats', date);
    const statsSnap = await getDoc(statsRef);

    if (statsSnap.exists()) {
      const data = statsSnap.data();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { updatedAt, ...statsData } = data;
      return statsData as DailyStats;
    }
  } catch (error) {
    console.error('Kunde inte hämta daglig statistik från molnet:', error);
  }
  return null;
}

/**
 * Hämta daglig statistik för flera dagar
 */
export async function getDailyStatsRangeFromCloud(dates: string[]): Promise<Map<string, DailyStats>> {
  if (!isFirebaseConfigured()) return new Map();

  const statsMap = new Map<string, DailyStats>();

  try {
    await Promise.all(dates.map(async (date) => {
      const stats = await getDailyStatsFromCloud(date);
      if (stats) {
        statsMap.set(date, stats);
      }
    }));
  } catch (error) {
    console.error('Kunde inte hämta statistik för datumintervall:', error);
  }

  return statsMap;
}

export default app;
