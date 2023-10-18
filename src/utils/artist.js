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
export async function createNewArtist(uid, email, name) {

    const userRef = doc(db, 'artist', user.uid);
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
  