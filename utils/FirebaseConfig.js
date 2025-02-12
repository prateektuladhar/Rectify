import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDZQVO47_tC4lGAoQ75CpNt1pSrJJgO0dA",
  authDomain: "rectify-21fbe.firebaseapp.com",
  projectId: "rectify-21fbe",
  storageBucket: "rectify-21fbe.appspot.com",
  messagingSenderId: "27073829681",
  appId: "1:27073829681:web:5e0abff54e5ad7b8566e10",
};


const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

export {  db };
