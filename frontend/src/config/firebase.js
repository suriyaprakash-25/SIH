// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBsDFk3fJPXaOtdblFhmWsz_TYzE5r1gZ8",
  authDomain: "sih-logins.firebaseapp.com",
  projectId: "sih-logins",
  storageBucket: "sih-logins.firebasestorage.app",
  messagingSenderId: "98924180809",
  appId: "1:98924180809:web:a2465bd9fa0006bcd49698",
  measurementId: "G-TKH4749SQZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, analytics };
export default app;