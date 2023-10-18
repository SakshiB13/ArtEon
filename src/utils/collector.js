import { User } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export async function createNewCollector(user,name,email) {
    const userRef = doc(db, 'collector', user.uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        userId: user.uid,
        name: name,
        email: email,
        profilePicture: user.photoURL,
      });
    
    }
  }
  