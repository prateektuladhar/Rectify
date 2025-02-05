import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"; 


const firebaseConfig = {
  apiKey: "AIzaSyDZQVO47_tC4lGAoQ75CpNt1pSrJJgO0dA",
  authDomain: "rectify-21fbe.firebaseapp.com",
  projectId: "rectify-21fbe",
  storageBucket: "rectify-21fbe.appspot.com",
  messagingSenderId: "27073829681",
  appId: "1:27073829681:web:5e0abff54e5ad7b8566e10",
};


const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();


let auth;
try {
  auth = getAuth(app); 
} catch (error) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}


const db = getFirestore(app);


export { auth, db };
