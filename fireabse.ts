// firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8sneYskawP0s0Xmp-C9jY6nGexgkbA6g",
  authDomain: "init-app-production.firebaseapp.com",
  projectId: "init-app-production",
  storageBucket: "init-app-production.firebasestorage.app",
  messagingSenderId: "1065244984297",
  appId: "1:1065244984297:web:15776998494c7e08be4178",
  measurementId: "G-SRZP0BMV81",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const db = getFirestore(app);

export { app, analytics, db };
