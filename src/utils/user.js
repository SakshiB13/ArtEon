// utils/user.js
import { collection, getDocs, query, where, limit, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export const getUserCollection = async (userId) => {
  const collections = ['artist', 'collector'];
  for (const collectionName of collections) {
    const querySnapshot = await getDocs(
      query(
        collection(db, collectionName),
        where('userId', '==', userId),
        limit(1)
      )
    );
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return { collectionName, userData };
    }
  }
  return null;
};

export const getUserCollectionbywalletId = async (walletId) => {
  const collections = ['artist', 'collector'];
  for (const collectionName of collections) {
    const querySnapshot = await getDocs(
      query(
        collection(db, collectionName),
        where('walletId', '==', walletId),
        limit(1)
      )
    );
    if (!querySnapshot.empty) {
      //console.log(collectionName)
      return collectionName;
    }
  }
  return null;
};

export const checkIfEmailExists = async (email) => {
  const usersRef = collection(db, 'users'); // Assuming 'users' is your collection name
  const q = query(usersRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty;
};
