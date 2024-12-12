import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfpbge7rM_57n9VwJKUNpcS4zU6PfVZwI",
  authDomain: "safe-journey-10f66.firebaseapp.com",
  projectId: "safe-journey-10f66",
  storageBucket: "safe-journey-10f66.firebasestorage.app",
  messagingSenderId: "90261558655",
  appId: "1:90261558655:web:ad7fe05d9cf8ef5285764a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);