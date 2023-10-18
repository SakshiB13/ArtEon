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

export async function createNewCollector(user) {
    const userRef = doc(db, 'collector', user.uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        userId: user.uid,
        name: user.name,
        email: user.email,
        profilePicture: user.photoURL,
      });
    }
  }
  