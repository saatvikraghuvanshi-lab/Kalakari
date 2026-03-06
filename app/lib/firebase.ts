import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Added for Authentication

const firebaseConfig = {
  // REPLACE the old key with this one from your "API key created" popup
  apiKey: "AIzaSyAWFOITwLxJilyAkncuht7Z1F_ZoFNZTns", 
  authDomain: "the-archive-project-f2ab4.firebaseapp.com",
  databaseURL: "https://the-archive-project-f2ab4-default-rtdb.firebaseio.com",
  projectId: "the-archive-project-f2ab4",
  storageBucket: "the-archive-project-f2ab4.firebasestorage.app",
  messagingSenderId: "198774506116",
  appId: "1:198774506116:web:a90f65dd5930c43bd478d1"
};

const app = initializeApp(firebaseConfig);

// Database for archive links
export const db = getDatabase(app);

// Authentication exports
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();