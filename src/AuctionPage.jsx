import React, { useEffect, useState } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import Chatbox from './components/Chatbox';
import { useTheme } from './components/themeContext';

const AuctionPage = () => {
  const [auctions, setAuctions] = useState([
    {
      id: 1,
      name: "NFT Artwork 1",
      image: "https://via.placeholder.com/150",
      startingBid: "1 ETH",
      startTime: new Date().getTime() + 10000, // Start in 10 seconds
      endTime: new Date().getTime() + 70000, // End in 1 minute 10 seconds
      registeredUsers: [],
      countdownFinished: false,
      biddingStarted: false
    },
    {
      id: 2,
      name: "NFT Artwork 2",
      image: "https://via.placeholder.com/150",
      startingBid: "0.5 ETH",
      startTime: new Date().getTime() + 20000, // Start in 20 seconds
      endTime: new Date().getTime() + 80000, // End in 1 minute 20 seconds
      registeredUsers: [],
      countdownFinished: false,
      biddingStarted: false
    }
  ]);
  const [currentUser, setCurrentUser] = useState("");
  const { darkMode } = useTheme();

  useEffect(() => {
    setCurrentUser("User123");
  }, []);

  const handleRegister = (auctionId) => {
    const auctionIndex = auctions.findIndex(auction => auction.id === auctionId);
    if (auctionIndex !== -1) {
      if (!auctions[auctionIndex].biddingStarted) { // Check if bidding has started
        if (!auctions[auctionIndex].registeredUsers.includes(currentUser)) {
          setAuctions(prevAuctions => {
            const updatedAuctions = [...prevAuctions];
            updatedAuctions[auctionIndex].registeredUsers.push(currentUser);
            return updatedAuctions;
          });
        }
      }
    }
  };

  const calculateTimeLeft = (endTime) => {
    const difference = endTime - new Date().getTime();
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      hours: hours < 10 ? `0${hours}` : hours,
      minutes: minutes < 10 ? `0${minutes}` : minutes,
      seconds: seconds < 10 ? `0${seconds}` : seconds
    };
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAuctions(prevAuctions => {
        return prevAuctions.map(auction => {
          if (auction.startTime <= new Date().getTime()) {
            if (!auction.biddingStarted) {
              // Auction started
              return { ...auction, biddingStarted: true };
            }
            const timeLeft = calculateTimeLeft(auction.endTime);
            if (timeLeft.hours <= 0 && timeLeft.minutes <= 0 && timeLeft.seconds <= 0) {
              // Auction ended
              return { ...auction, countdownFinished: true };
            }
          }
          return auction;
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
              <div className="nft-image-container">
                <img className="nft-image" src={auction.image} alt={auction.name} />
              </div>
              <div className="auction-details">
                <h2 className="nft-name">{auction.name}</h2>
                <p className="starting-bid">Starting Bid: {auction.startingBid}</p>
                <p className="timestamp-countdown">
                  {auction.biddingStarted ? (
                    auction.countdownFinished ? "Auction Ended" :
                    `Ends In: ${calculateTimeLeft(auction.endTime).hours}h ${calculateTimeLeft(auction.endTime).minutes}m ${calculateTimeLeft(auction.endTime).seconds}s`
                  ) : (
                    `Starts In: ${calculateTimeLeft(auction.startTime).hours}h ${calculateTimeLeft(auction.startTime).minutes}m ${calculateTimeLeft(auction.startTime).seconds}s`
                  )}
                </p>
                {auction.registeredUsers.includes(currentUser) ? (
                  <button className="start-bidding-btn" disabled={!auction.biddingStarted || auction.countdownFinished} onClick={() => handleOpenChatbox(auction.id)}>{auction.biddingStarted ? "Join Auction" : "Bidding Not Started"}</button>
                ) : (
                  <button className="register-btn" disabled={auction.biddingStarted} onClick={() => handleRegister(auction.id)}>Register</button> // Disable register button if auction has started
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
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};


export default AuctionPage;
