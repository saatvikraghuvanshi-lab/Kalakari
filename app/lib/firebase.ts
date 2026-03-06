// app/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // 1. Use Database instead of Firestore
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCfcKe3L9ILLITQcUpacBAtGuG88Cs1id4",
  authDomain: "the-archive-project-f2ab4.firebaseapp.com",
  projectId: "the-archive-project-f2ab4",
  storageBucket: "the-archive-project-f2ab4.firebasestorage.app",
  messagingSenderId: "198774506116",
  appId: "1:198774506116:web:a90f65dd5930c43bd478d1"
};

const app = initializeApp(firebaseConfig);

// 2. Export db as the Realtime Database instance
export const db = getDatabase(app); 
export const storage = getStorage(app);