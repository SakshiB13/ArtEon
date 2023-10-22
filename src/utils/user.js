import { collection, getDocs, query, where, limit } from 'firebase/firestore';
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
      return collectionName;
    }
  }
  return null;
};