import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  doc,
  getDocFromServer,
  Firestore
} from 'firebase/firestore';
import localFirebaseConfig from '../firebase-applet-config.json';

// Support both Vercel environment variables and local applet config
const resolvedFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || localFirebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || localFirebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || localFirebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || localFirebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || localFirebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || localFirebaseConfig.appId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || localFirebaseConfig.firestoreDatabaseId
};

const app = getApps().length === 0 ? initializeApp(resolvedFirebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Configure Firestore with long-polling to prevent WebSocket/WebChannel disconnection errors in iframes & proxies
let firestoreInstance: Firestore;
const targetDatabaseId = resolvedFirebaseConfig.firestoreDatabaseId || undefined;

try {
  firestoreInstance = initializeFirestore(
    app,
    {
      experimentalForceLongPolling: true,
    },
    targetDatabaseId
  );
} catch {
  firestoreInstance = targetDatabaseId
    ? getFirestore(app, targetDatabaseId)
    : getFirestore(app);
}

export const db = firestoreInstance;

// Test Firestore connectivity on boot as per Firebase guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Operating in offline-cached mode. Please check network/Firebase configuration.');
    }
  }
}
testConnection();

export default app;
