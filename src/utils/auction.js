import { User } from 'firebase/auth';
import { collection, addDoc, getDocs} from 'firebase/firestore';
import { db } from './firebase';

export async function createAuctions(auctionData) {
    try {
      // Create a new auction document in the 'auctions' collection
      const collectionRef = collection(db,'auctions');
      const auctionRef = await addDoc(collectionRef, {
        auctionId: auctionData.auctionId,
        tokenId: auctionData.tokenId,
        startPrice: auctionData.startPrice,
        startTime: auctionData.startTime,
        endTime: auctionData.endTime,
        seller: auctionData.seller,
        active: auctionData.active,
        currentBid: auctionData.currentBid || 'N/A',
        currentBidder: auctionData.currentBidder || '0',
        metadataURI: auctionData?.metadataURI,
      });
      if(auctionRef){
      console.log(`Auction created successfully with ID: ${auctionRef.id}`);
      return auctionRef.id;
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
          startTime: auctionData.startTime.toDate(), // Convert Firestore Timestamp to Date
          endTime: auctionData.endTime.toDate(),     // Convert Firestore Timestamp to Date
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