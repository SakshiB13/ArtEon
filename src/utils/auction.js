import { User } from 'firebase/auth';
import { collection, addDoc, getDocs, doc} from 'firebase/firestore';
import { db } from './firebase';

export async function createAuctions(auctionData) {
    try {
      // Create a new auction document in the 'auctions' collection
      //const collectionRef = ;
      console.log(auctionData);
      const auctionRef = await addDoc(collection(db,'auctions'), {
        active: auctionData.active,
        name: auctionData.name,
        auctionId: Number(auctionData.auctionId), // Convert BigInt to string
        currentBid: auctionData.currentBid,
        currentBidder: auctionData.currentBidder,
        endTime: Number(auctionData.endTime), // Convert BigInt timestamp to Date
        metadataURI: auctionData.metadataURI,
        seller: auctionData.seller,
        startPrice: Number(auctionData.startPrice), // Convert BigInt to string
        startTime: Number(auctionData.startTime), // Convert BigInt timestamp to Date
        tokenId: Number(auctionData.tokenId),
      });

    const registerSubcollectionRef = collection(auctionRef, 'registeredusers');
    const registerDocRef = await addDoc(registerSubcollectionRef, {});

    const bidsSubcollectionRef = collection(auctionRef, 'bids');
    const bidsDocRef = await addDoc(bidsSubcollectionRef, {});
      if(auctionRef && registerDocRef && bidsDocRef ){
      console.log(`Auction created successfully with ID: ${auctionRef.id}`);
      return [auctionRef.id, registerDocRef.id] ;
      } // Return the ID of the created auction document
    } catch (error) {
      console.error('Error creating auction:', error);
      throw error; // Propagate the error back to the caller
    }
}    

export async function getAllAuctions() {
  try {
      const collectionRef = collection(db, 'auctions');
      const querySnapshot = await getDocs(collectionRef);

      const auctions = [];

      for (const doc of querySnapshot.docs) {
          const auctionData = doc.data();
          const registeredUsersRef = collection(doc.ref, 'registeredusers');
          const registeredUsersSnapshot = await getDocs(registeredUsersRef);

          const registeredUsers = [];

          registeredUsersSnapshot.forEach((userDoc) => {
              const userData = userDoc.data();
              registeredUsers.push({
                  userId: userData.userId,
                  username: userData.username,
                  registrationDate: userData.registrationDate,
              });
          });

          auctions.push({
              id: doc.id,
              tokenId: auctionData.tokenId,
              name: auctionData.name,
              startPrice: auctionData.startPrice,
              startTime: auctionData.startTime,
              endTime: auctionData.endTime,
              seller: auctionData.seller,
              active: auctionData.active,
              currentBid: auctionData.currentBid || null,
              currentBidder: auctionData.currentBidder || null,
              metadataURI: auctionData.metadataURI,
              registeredUsers: registeredUsers,
          });
      }

      return auctions;
  } catch (error) {
      console.error('Error fetching auctions:', error);
      throw error;
  }
}
  export async function registerUserForAuction(auctionId, userId, username) {
    try {
      // Get the auction document reference
      const auctionDocRef = doc(db, 'auctions', auctionId);
        const registeredUsersRef = collection(auctionDocRef, 'registeredusers');
        const registerDocRef = await addDoc(registeredUsersRef, {
        userId: userId,
        username: username,
        registrationDate: new Date(), // Optionally include registration date/time
      });
  
      console.log("User registered successfully for auction");
      return true; // Return the ID of the registered document
    } catch (error) {
      console.error('Error registering user for auction:', error);
      throw error; // Propagate the error back to the caller
    }
  }