// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
  } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyBfToOn7Wua4TUaI2AxUgbrzY8CE3KvQWk",
  authDomain: "arteon-75ecc.firebaseapp.com",
  projectId: "arteon-75ecc",
  storageBucket: "arteon-75ecc.appspot.com",
  messagingSenderId: "660729744578",
  appId: "1:660729744578:web:fdcd0d73f9aa1286987f5b",
  measurementId: "G-3K0ZWLEH1N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


export { db, auth, provider, storage };