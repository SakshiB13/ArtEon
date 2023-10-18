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

export async function createNewArtist(user, email, name) {

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

  export async function updateArtistWalletId(userId, walletId) {
    const userRef = doc(db, 'artist', userId);

    try {
        await updateDoc(userRef, {
            walletId: walletId,
        });
        console.log('Wallet ID updated successfully.');
    } catch (error) {
        console.error('Error updating wallet ID:', error);
    }
}
 
export async function getArtistNameByUID(userId) {
  const userRef = doc(db, 'artist', userId); 
  try {
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.name;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user name:', error);
    throw error; 
  }
}