import React, { useEffect, useState } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import { useTheme } from './components/themeContext'; // Import the useTheme hook
import { getAllAuctions, registerUserForAuction } from './utils/auction'
import { useGlobalState, setGlobalState, setLoadingMsg, setAlert } from './store';
import { auth } from './utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Chatbox from './components/Chatbox';

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
        window.location.reload();
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
    //console.log(currentTime);
    // Calculate time difference to auction start time
    const startDifference = startTime * 1000 - currentTime;
    const startHours = Math.floor((startDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const startMinutes = Math.floor((startDifference % (1000 * 60 * 60)) / (1000 * 60));
    const startSeconds = Math.floor((startDifference % (1000 * 60)) / 1000);

    // Calculate time difference to auction end time
    const endDifference = endTime * 1000 - currentTime;
    const endHours = Math.floor((endDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const endMinutes = Math.floor((endDifference % (1000 * 60 * 60)) / (1000 * 60));
    const endSeconds = Math.floor((endDifference % (1000 * 60)) / 1000);

    return {
      start: { hours: startHours, minutes: startMinutes, seconds: startSeconds },
      end: { hours: endHours, minutes: endMinutes, seconds: endSeconds }
    };
  };



  useEffect(() => {
    const intervalId = setInterval(() => {
      setAuctions(prevAuctions => {
        //console.log('Previous Auctions:', prevAuctions);

        const updatedAuctions = prevAuctions.map(auction => {
          if (!auction) return auction; // Ensure to handle undefined auctions

          const timeLeft = calculateTimeLeft(auction.startTime, auction.endTime);
          //console.log(timeLeft)
          if (!auction.biddingStarted) {
            const isAuctionStarted = auction.startTime * 1000 <= currentTime;
            return { ...auction, timeLeft, biddingStarted: isAuctionStarted };
          }
          if (timeLeft.end.hours <= 0 && timeLeft.end.minutes <= 0 && timeLeft.end.seconds <= 0) {
            // Auction ended
            //console.log('Auction ended:', auction.id);
            return { ...auction, timeLeft, countdownFinished: true };
          }

          return { ...auction, timeLeft };
        });

        //console.log('Updated Auctions:', updatedAuctions);
        return updatedAuctions;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [auctions]);


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
      <div className={`container-fluid mx-auto px-5 ${darkMode ? 'bg-white' : ''}`} style={{ paddingTop: '20px', paddingBottom: '20px', display: 'flex', justifyContent: 'center' }}>
        <div className="grid grid-cols-5 gap-8" style={{  marginLeft:  '100px',marginRight:'100px' }}>
          {auctions.map((auction) => (
            auction && (
              <div key={auction.id} className={`relative w-full shadow-xl shadow-black rounded-md overflow-hidden my-2 p-3 ${darkMode ? 'bg-[#800080]' : 'bg-gray-400'}`}>
                <div>
                 {/*  <div className="nft-image-container"> */}
                    <img className="h-60 w-full object-cover shadow-lg shadow-black rounded-lg mb-3" src={auction.metadataURI} alt={auction.name} />
                  {/* </div> */}
                  <div className="auction-details">
                    <h2 className="nft-name">{auction.name}</h2>
                    <p className="starting-bid">Starting Bid: {window.web3.utils.fromWei(auction.startPrice.toString(), 'ether')} ETH</p>
                    <p className="timestamp-countdown">
                      {auction.biddingStarted ? (
                        auction.countdownFinished ? "Auction Ended" :
                          `Ends In: ${auction.timeLeft?.end.hours}h ${auction.timeLeft?.end.minutes}m ${auction.timeLeft?.end.seconds}s`
                      ) : (
                        `Starts In: ${auction.timeLeft?.start.hours}h ${auction.timeLeft?.start.minutes}m ${auction.timeLeft?.start.seconds}s`
                      )}
                    </p>
                    {auction.registeredUsers.some(user => user.userId === currentUser) ? (
                      <button className="start-bidding-btn" disabled={!auction.biddingStarted || auction.countdownFinished} onClick={() => handleOpenChatbox(auction.id)}>
                        {auction.biddingStarted ? "Join Auction" : "Bidding Not Started"}</button>) : (
                      <button className="register-btn" disabled={auction.biddingStarted} onClick={() => handleRegister(auction.id)}>Register</button>
                    )}
                    {auction.chatboxOpen && (
                      <Chatbox
                        auctionId={auction.id}
                        currentUser={currentUser}
                        onClose={() => handleCloseChatbox(auction.id)}
                        auctionEndTime={auction.endTime} // Pass auction end time to the Chatbox
                        auction={auction} // Pass the auction object to the Chatbox
                      />
                    )}
                  </div>
                </div>
              </div>
            )
          ))}
        </div>

      </div>

      <Footer />
    </div>
  );
};


export default AuctionPage;