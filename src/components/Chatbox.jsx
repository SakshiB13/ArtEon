import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, setDoc, doc, onSnapshot} from 'firebase/firestore';
import { db } from '../utils/firebase';


const Chatbox = ({ auctionId, currentUser, onClose, auctionEndTime, auction }) => {
  const [bids, setBids] = useState([]);
  const [timer, setTimer] = useState(Math.floor((auction.endTime * 1000 - new Date().getTime()) / 1000));
  const [highestBid, setHighestBid] = useState(0);
  const [Bid, setBid] = useState(0);

  const [errorMessage, setErrorMessage] = useState('');
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);
  const [showLoserMessage, setShowLoserMessage] = useState(false);
  const startingBid = parseFloat(auction.startingBid);
  const auctionid = auction.id;

  const fetchBids = async () => {
    const bidsCollectionRef = collection(db, `auctions/${auctionid}/bids`);
    const bidsQuery = query(bidsCollectionRef, orderBy('amount', 'desc'));
  
    try {
      const snapshot = await getDocs(bidsQuery);
      const bidsData = snapshot.docs.map(doc => {
        const bidData = doc.data();
        return {
          userId: bidData.userId,
          amount: bidData.amount
        };
      });
      setBids(bidsData);
  
      if (bidsData.length > 0) {
        const highest = Math.max(...bidsData.map(bid => bid.amount));
        setHighestBid(highest);
      }
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
  
    // Add listener for updates to bids
    const unsubscribe = onSnapshot(bidsQuery, (snapshot) => {
      const updatedBids = snapshot.docs.map(doc => {
        const bidData = doc.data();
        return {
          userId: bidData.userId,
          amount: bidData.amount
        };
      });
      setBids(updatedBids);
  
      if (updatedBids.length > 0) {
        const highest = Math.max(...updatedBids.map(bid => bid.amount));
        setHighestBid(highest);
      }
    });
  
    return unsubscribe; // Return the unsubscribe function
  };
  
  useEffect(() => {
    const unsubscribe = fetchBids();
    // Return a cleanup function to unsubscribe when component unmounts
    return () => unsubscribe();
  }, []);
   
  

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer - 1);
      //fetchBids();
      //console.log(bids);
    }, 1000);
    
    

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    fetchBids();
      console.log(bids);
  }, []);

  useEffect(() => {
    if (timer <= 0 && highestBid > 0) {
      setShowWinnerPopup(true);
    } else if (timer <= 0) {
      handleClose();
      setShowLoserMessage(true);
    }
  }, [timer, highestBid]);

  const handleClose = () => {
    setShowWinnerPopup(false);
    onClose();
  };
  const isNumeric = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  };

  
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours > 0 ? hours + "h " : ""}${minutes > 0 ? minutes + "m " : ""}${seconds}s`;
  };


  const handlePlaceBid = () => {
    const bidAmount = parseFloat(Bid);
    if (isNaN(bidAmount) || bidAmount <= 0) {
      setErrorMessage('Please enter a valid bid amount.');
      return;
    }

    if (bidAmount <= highestBid) {
      setErrorMessage('Your bid must be higher than the current highest bid.');
      return;
    }

    const bidsCollectionRef = collection(db, `auctions/${auctionid}/bids`);
    const newBidRef = doc(bidsCollectionRef);

    setDoc(newBidRef, {
      userId: currentUser,
      amount: bidAmount,
      timestamp: new Date().getTime(),
    }).then(() => {
      setErrorMessage('');
      fetchBids(); // Fetch bids after successfully placing a bid
      console.log(bids);
    }).catch(error => {
      console.error('Error placing bid:', error);
      setErrorMessage('Error placing bid');
    });
  };

  const handleCloseChatbox = () => {
    onClose(); // Call the onClose prop function to close the chatbox
  };


  return (
    <div className="chatbox-container">
      <div className="chatbox">
      <div className="bids-list">
  <h3>All Bids:</h3>
  <div className="scrollable-text">
    {bids.map((bid, index) => (
      <span key={index}>{bid.userId}: {bid.amount}<br /></span>
    ))}
  </div>
        <div className="input-container">
          
          <input
            type="text"
            placeholder="Place your bid..."
            //value={highestBid}
            onChange={(e) => setBid(e.target.value)}
          />
          <button onClick={handlePlaceBid}>Place Bid</button>
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="info">
        <div className="timer">Time Remaining: {formatTime(timer)}</div>
          <div className="highest-bid">Current Highest Bid: {highestBid}</div>
      <button className="close-button" onClick={handleCloseChatbox}>x</button>

        </div>
        
</div>

      </div>
      {showWinnerPopup && (
        <div className="winner-popup">
          <div className="winner-message">Congratulations! You won the auction with the highest bid of {highestBid}.</div>
          <button onClick={handleClose}>Confirm Transaction</button>
        </div>
      )}
      {showLoserMessage && (
        <div className="loser-message">Sorry, you lost the auction.</div>
      )}
    </div>
  );

};

export default Chatbox;