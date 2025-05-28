// lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxLGHIS_eZwYcis3yLI5sXcPUuX2DUm4I",
  authDomain: "pcpartsmakerai.firebaseapp.com",
  projectId: "pcpartsmakerai",
  storageBucket: "pcpartsmakerai.firebasestorage.app",
  messagingSenderId: "231187300447",
  appId: "1:231187300447:web:ce167e5d13764b35de1bea"
};

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);