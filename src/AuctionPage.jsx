import React, { useEffect, useState } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import { useTheme } from './components/themeContext'; // Import the useTheme hook
import { getAllAuctions, registerUserForAuction } from './utils/auction'
import { useGlobalState, setGlobalState, setLoadingMsg, setAlert } from './store';
import { auth } from './utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const AuctionPage = () => {
  const [userInfo] = useAuthState(auth);
  const [userName] = useGlobalState('userName');
  const [auctions, setAuctions] = useState([]);
  const currentTime = new Date().getTime();
  const currentUser = userInfo?.uid;
  //console.log(userInfo);
  //console.log(currentUser);
  useEffect(() => {
    // Fetch auctions when component mounts
    const fetchAuctions = async () => {
      try {
        const fetchedAuctions = await getAllAuctions();
        setAuctions(fetchedAuctions);
        console.log(fetchedAuctions);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      }
    };

    fetchAuctions();
  }, []);
  const { darkMode } = useTheme(); // Get darkMode state from the theme context

  // Function to handle user registration for auction
  const handleRegister = async (auctionId) => {
    console.log(auctionId);
    const userId = userInfo.uid;
    try {
      if (!userId || !auctionId) return;
      const registeruser = await registerUserForAuction(auctionId, userId, userName);
      //console.log(userName);
      //console.log(registeruser);
      if (registeruser) {
        setAlert('You have successfully registered for Auction', 'green');
      }
    } catch (error) {
      console.error('An error occurred while trying to register you for this auction.', error);
      setAlert('An error occurred while trying to register you for this auction.', 'red');
      // Handle error (e.g., display error message to user)
    }
  };

  // Function to calculate time left for the auction
  const calculateTimeLeft = (startTime, endTime) => {
    const currentTime = new Date().getTime();

    // Calculate time difference to auction start time
    const startDifference = startTime - currentTime;
    const startHours = Math.floor((startDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const startMinutes = Math.floor((startDifference % (1000 * 60 * 60)) / (1000 * 60));
    const startSeconds = Math.floor((startDifference % (1000 * 60)) / 1000);

    // Calculate time difference to auction end time
    const endDifference = endTime - currentTime;
    const endHours = Math.floor((endDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const endMinutes = Math.floor((endDifference % (1000 * 60 * 60)) / (1000 * 60));
    const endSeconds = Math.floor((endDifference % (1000 * 60)) / 1000);

    return {
      start: {
        hours: startHours < 10 ? `0${startHours}` : startHours,
        minutes: startMinutes < 10 ? `0${startMinutes}` : startMinutes,
        seconds: startSeconds < 10 ? `0${startSeconds}` : startSeconds
      },
      end: {
        hours: endHours < 10 ? `0${endHours}` : endHours,
        minutes: endMinutes < 10 ? `0${endMinutes}` : endMinutes,
        seconds: endSeconds < 10 ? `0${endSeconds}` : endSeconds
      }
    };
  };


  useEffect(() => {
    const intervalId = setInterval(() => {
      setAuctions(prevAuctions => {
        return prevAuctions.map(auction => {
          if (!auction) return auction; 
          const timeLeft = calculateTimeLeft(auction.startTime, auction.endTime); // Calculate timeLeft
          //return { ...auction, timeLeft };
          if (!auction.biddingStarted && timeLeft.end.hours <= 0 && timeLeft.end.minutes <= 0 && timeLeft.end.seconds <= 0) {
            // Auction ended
            return { ...auction, timeLeft, countdownFinished: true, biddingStarted:true };
          } // Update auction with timeLeft
        });
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleOpenChatbox = (auctionId) => {
    setAuctions(prevAuctions => {
      return prevAuctions.map(prevAuction => {
        if (prevAuction.id === auctionId) {
          return { ...prevAuction, chatboxOpen: true };
        }
        return prevAuction;
      });
    });
  };

  const handleCloseChatbox = (auctionId) => {
    setAuctions(prevAuctions => {
      return prevAuctions.map(prevAuction => {
        if (prevAuction.id === auctionId) {
          return { ...prevAuction, chatboxOpen: false };
        }
        return prevAuction;
      });
    });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-white' : ''}`}>
      <div className={`gradient-bg-hero ${darkMode ? 'bg-white' : ''}`}>
        <Header />
      </div>
      <div className={`container-fluid mx-auto container-body-signupp px-5 ${darkMode ? 'bg-white' : ''}`}>
  <div className="grid grid-cols-5 gap-8">
    {auctions.map((auction) => (
      <div key={auction.id} className="auction-card">
        {auction && (
          <div>
            <div className="nft-image-container">
              <img className="nft-image" src={auction.metadataURI} alt={auction.name} />
            </div>
            <div className="auction-details">
              <h2 className="nft-name">{auction.name}</h2>
              <p className="starting-bid">Starting Bid: {window.web3.utils.fromWei(auction.startPrice.toString(), 'ether')} ETH</p>
              <p className="timestamp-countdown">
                {auction.biddingStarted ? (
                  auction.countdownFinished ? "Auction Ended" :
                  `Ends In: ${auction.timeLeft?.end.hours}h ${auction.timeLeft?.end.minutes}m ${auction.timeLeft?.end.seconds}s`
                ) : (
                  `Starts In:${auction.timeLeft?.start.hours}h ${auction.timeLeft?.start.minutes}m ${auction.timeLeft?.start.seconds}s`
                )}
              </p>
              {auction.registeredUsers.some(user => user.userId === currentUser) ? (
                <button className="start-bidding-btn" disabled={!auction.countdownFinished}>Start Bidding</button>
              ) : (
                <button className="register-btn" onClick={() => handleRegister(auction.id)}>Register</button>
              )}
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
</div>

      <Footer />
    </div>
  );
};


export default AuctionPage;
