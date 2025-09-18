import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, enableNetwork, disableNetwork, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sarathi-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sarathi-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sarathi-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with proper offline persistence
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

// Initialize Firebase Auth
export const auth = getAuth(app);

// Enable offline persistence and emulator setup
export const initializeFirebaseServices = async () => {
  try {
    // In development, connect to emulators if available
    if (import.meta.env.DEV && import.meta.env.VITE_FIREBASE_EMULATOR_HOST) {
      connectFirestoreEmulator(db, import.meta.env.VITE_FIREBASE_EMULATOR_HOST, 8080);
      connectAuthEmulator(auth, `http://${import.meta.env.VITE_FIREBASE_EMULATOR_HOST}:9099`);
    }
    
    console.log('Firebase services initialized with offline persistence');
  } catch (error) {
    console.warn('Failed to initialize Firebase services:', error);
  }
};

export const goOnline = () => enableNetwork(db);
export const goOffline = () => disableNetwork(db);

// Initialize Firebase services on load
initializeFirebaseServices();
