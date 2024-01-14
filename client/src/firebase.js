// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "edward-travel-guide.firebaseapp.com",
  projectId: "edward-travel-guide",
  storageBucket: "edward-travel-guide.appspot.com",
  messagingSenderId: "480807868829",
  appId: "1:480807868829:web:5a029dd9d93fc73e56b774",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
