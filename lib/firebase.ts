// lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKeyForBuildTime1234567890",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "lmc-pune.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "lmc-pune",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "lmc-pune.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "908827077225",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:908827077225:web:86253296299b97ad0bd0f8",
};

function getFirebaseApp(): FirebaseApp | null {
  try {
    return getApps().length ? getApp() : initializeApp(firebaseConfig);
  } catch (e) {
    if (typeof window !== 'undefined') {
      console.warn("Firebase initialization error:", e);
    }
    return null;
  }
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  if (!app) return null;
  try {
    return getAuth(app);
  } catch (e) {
    if (typeof window !== 'undefined') {
      console.warn("Firebase getAuth error:", e);
    }
    return null;
  }
}

// Lazy safe proxy for existing firebaseAuth imports so it doesn't throw during SSR / static page builds
export const firebaseAuth: Auth = new Proxy({} as Auth, {
  get(_target, prop) {
    const auth = getFirebaseAuth();
    if (!auth) {
      return undefined;
    }
    const val = (auth as any)[prop];
    return typeof val === 'function' ? val.bind(auth) : val;
  },
});

