import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 

// Firebase config (only appId taken from .env)
const firebaseConfig = {
  apiKey: "AIzaSyDkA6Tt1OH4_kbBw8qoCuT4nckAlOAFlKM",
  authDomain: "task-manager-app-ba470.firebaseapp.com",
  projectId: "task-manager-app-ba470",
  storageBucket: "task-manager-app-ba470.firebasestorage.app",
  messagingSenderId: "406202636571",
  appId: import.meta.env.VITE_APP_ID,  // taken from env
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
