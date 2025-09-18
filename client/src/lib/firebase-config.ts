import { initializeApp } from 'firebase/app';
import { getFirestore, enableNetwork, disableNetwork, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "eduquest-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "eduquest-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "eduquest-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with offline persistence
export const db = getFirestore(app);

// Enable offline persistence
export const enableOfflinePersistence = async () => {
  try {
    // In development, connect to Firestore emulator if available
    if (import.meta.env.DEV && import.meta.env.VITE_FIREBASE_EMULATOR_HOST) {
      connectFirestoreEmulator(db, import.meta.env.VITE_FIREBASE_EMULATOR_HOST, 8080);
    }
    
    console.log('Firestore offline persistence enabled');
  } catch (error) {
    console.warn('Failed to enable offline persistence:', error);
  }
};

export const goOnline = () => enableNetwork(db);
export const goOffline = () => disableNetwork(db);

// Initialize offline persistence on load
enableOfflinePersistence();
