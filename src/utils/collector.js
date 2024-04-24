// import { User } from 'firebase/auth';
// import {
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   setDoc,
//   updateDoc,
// } from 'firebase/firestore';
// import { db } from './firebase';

// export async function createNewCollector(user,name,email) {

//     const userRef = doc(db, 'collector', user.uid);
//     const userDoc = await getDoc(userRef);
//     if (!userDoc.exists()) {
//       await setDoc(userRef, {
//         userId: user.uid,

//         name: name,
//         email: email,
//         profilePicture: user.photoURL,
//       });
    
//     }
//   }

//   export async function updateCollectorWalletId(userId, walletId) {
//     const userRef = doc(db, 'collector', userId);

//     try {
//         await updateDoc(userRef, {
//             walletId: walletId,
//         });
//         console.log('Wallet ID updated successfully.');
//     } catch (error) {
//         console.error('Error updating wallet ID:', error);
//     }
// }

// export async function getCollectorNameByUID(userId) {
//   const userRef = doc(db, 'collector', userId); 
//   try {
//     const userDoc = await getDoc(userRef);

//     if (userDoc.exists()) {
//       const userData = userDoc.data();
//       return userData.name;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error('Error fetching user name:', error);
//     throw error; 
//   }
// }
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { db, storage } from './firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export async function createNewCollector(user, email, name) {
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

export async function updateCollectorWalletId(userId, walletId) {
  const userRef = doc(db, 'collector', userId);

  try {
    await updateDoc(userRef, {
      walletId: walletId,
    });
    console.log('Wallet ID updated successfully.');
  } catch (error) {
    console.error('Error updating wallet ID:', error);
  }
}

export async function getCollectorNameByUID(userId) {
  const userRef = doc(db, 'collector', userId); 
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

export async function updateCollectorProfile(userId, name, quote, email, insta, website, profilePicFile, bannerPicFile) {
  const userRef = doc(db, 'collector', userId);

  try {
    // Upload profile picture to Firebase Storage
    let profilePicUrl = '';
    if (profilePicFile) {
      const profilePicRef = ref(storage, `collectors/${userId}/profilePic`);
      await uploadBytes(profilePicRef, profilePicFile);
      profilePicUrl = await getDownloadURL(profilePicRef);
    }

    // Upload banner picture to Firebase Storage
    let bannerPicUrl = '';
    if (bannerPicFile) {
      const bannerPicRef = ref(storage, `collectors/${userId}/bannerPic`);
      await uploadBytes(bannerPicRef, bannerPicFile);
      bannerPicUrl = await getDownloadURL(bannerPicRef);
    }

    // Update collector document in Firestore with new data including image URLs
    await updateDoc(userRef, {
      name: name,
      quote: quote,
      email: email,
      insta: insta,
      website: website,
      profilePicture: profilePicUrl,
      bannerPicture: bannerPicUrl,
    });

    console.log('Collector profile updated successfully.');
    return true;
  } catch (error) {
    console.error('Error updating collector profile:', error);
    throw error;
  }
}

export async function getAllCollectors() {
  const collectorsCollection = collection(db, 'collector');

  try {
    const querySnapshot = await getDocs(collectorsCollection);
    const collectors = [];

    querySnapshot.forEach((doc) => {
      // Retrieve each collector document's data
      const collectorData = doc.data();
      // Include the document ID as part of the collector data
      const collectorWithId = { id: doc.id, ...collectorData };
      // Push the collector data into the array
      collectors.push(collectorWithId);
    });

    return collectors; // Return the array of collectors
  } catch (error) {
    console.error('Error fetching collectors:', error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

export async function getCollectorByWalletId(walletId) {
  try {
    const collectorCollectionRef = collection(db, 'collector'); // Reference to the 'collector' collection
    const q = query(collectorCollectionRef, where('walletId', '==', walletId)); // Query to find documents where 'walletId' matches

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Assuming there should be only one document matching the 'walletId'
      const collectorDoc = querySnapshot.docs[0];
      const collectorData = collectorDoc.data();
      return collectorData;
    } else {
      console.log(`Collector with walletId ${walletId} not found`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching collector:', error);
    throw error;
  }
}
