import { User } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query, where,
} from 'firebase/firestore';
import { db, storage } from './firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

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

export async function updateArtistProfile(userId, name, quote, email, insta, website, profilePicFile, bannerPicFile) {
  const userRef = doc(db, 'artist', userId);

  try {
    // Upload profile picture to Firebase Storage
    let profilePicUrl = '';
    if (profilePicFile) {
      const profilePicRef = ref(storage, `artists/${userId}/profilePic`);
      await uploadBytes(profilePicRef, profilePicFile);
      profilePicUrl = await getDownloadURL(profilePicRef);
    }

    // Upload banner picture to Firebase Storage
    let bannerPicUrl = '';
    if (bannerPicFile) {
      const bannerPicRef = ref(storage, `artists/${userId}/bannerPic`);
      await uploadBytes(bannerPicRef, bannerPicFile);
      bannerPicUrl = await getDownloadURL(bannerPicRef);
    }

    // Update artist document in Firestore with new data including image URLs
    await updateDoc(userRef, {
      name: name,
      quote: quote,
      email: email,
      insta: insta,
      website: website,
      profilePicture: profilePicUrl,
      bannerPicture: bannerPicUrl,
    });

    console.log('Artist profile updated successfully.');
    return true;
  } catch (error) {
    console.error('Error updating artist profile:', error);
    throw error;
  }
}

export async function getAllArtists () {
  const artistsCollection = collection(db, 'artist');

  try {
    const querySnapshot = await getDocs(artistsCollection);
    const artists = [];

    querySnapshot.forEach((doc) => {
      // Retrieve each artist document's data
      const artistData = doc.data();
      // Include the document ID as part of the artist data
      const artistWithId = { id: doc.id, ...artistData };
      // Push the artist data into the array
      artists.push(artistWithId);
    });

    return artists; // Return the array of artists
  } catch (error) {
    console.error('Error fetching artists:', error);
    throw error; // Rethrow the error to handle it in the calling code
  }
};

export async function getArtistByWalletId(walletId) {
  try {
    const artistCollectionRef = collection(db, 'artist'); // Reference to the 'artist' collection
    const q = query(artistCollectionRef, where('walletId', '==', walletId)); // Query to find documents where 'walletId' matches

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Assuming there should be only one document matching the 'walletId'
      const artistDoc = querySnapshot.docs[0];
      const artistData = artistDoc.data();
      return artistData;
    } else {
      console.log(`Artist with walletId ${walletId} not found`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching artist:', error);
    throw error;
  }
}