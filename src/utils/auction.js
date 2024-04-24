import { User } from 'firebase/auth';
import { collection, addDoc, getDocs} from 'firebase/firestore';
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
      if(auctionRef && registerDocRef ){
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
      // Reference the 'auctions' collection
      const collectionRef = collection(db, 'auctions');
  
      // Get all documents (auctions) from the 'auctions' collection
      const querySnapshot = await getDocs(collectionRef);
  
      // Array to store fetched auctions
      const auctions = [];
  
      // Loop through each document snapshot and extract auction data
      querySnapshot.forEach((doc) => {
        // Get auction data from the document
        const auctionData = doc.data();
        // Add auction data to the auctions array
        auctions.push({
          id: doc.id,
          tokenId: auctionData.tokenId,
          startPrice: auctionData.startPrice,
          startTime:auctionData.startTime ,
          endTime: auctionData.endTime ,     
          seller: auctionData.seller,
          active: auctionData.active,
          currentBid: auctionData.currentBid || null,
          currentBidder: auctionData.currentBidder || null,
          metadataURI: auctionData.metadataURI
        });
      });
  
      // Return the array of auctions
      return auctions;
    } catch (error) {
      console.error('Error fetching auctions:', error);
      throw error; // Propagate the error back to the caller
    }
  }

  export async function registerUserForAuction(auctionId, userId) {
    try {
      // Get the auction document reference
      const auctionDocRef = doc(db, 'auctions', auctionId);
  
      // Create a reference to the 'registeredusers' subcollection under the auction document
      const registeredUsersRef = collection(auctionDocRef, 'registeredusers');
  
      // Add a new document in the 'registeredusers' subcollection with the user ID
      const registerDocRef = await addDoc(registeredUsersRef, {
        userId: userId,
        registrationDate: new Date(), // Optionally include registration date/time
      });
  
      console.log(`User registered successfully for auction ${auctionId}`);
      return registerDocRef.id; // Return the ID of the registered document
    } catch (error) {
      console.error('Error registering user for auction:', error);
      throw error; // Propagate the error back to the caller
    }
  }