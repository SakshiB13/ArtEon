//AuctionPage.jsx

import React, { useEffect, useState } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import { useTheme } from './components/themeContext'; // Import the useTheme hook

const AuctionPage = () => {
  const [auctions, setAuctions] = useState([
    {
      id: 1,
      name: "NFT Artwork 1",
      image: "https://via.placeholder.com/150",
      startingBid: "1 ETH",
      endTime: new Date().getTime() + 60000, // 1 hour from now
      registeredUsers: [], // Array to store registered users
      countdownFinished: false // State to track countdown status
    },
    {
      id: 2,
      name: "NFT Artwork 2",
      image: "https://via.placeholder.com/150",
      startingBid: "0.5 ETH",
      endTime: new Date().getTime() + 7200000, // 2 hours from now
      registeredUsers: [],
      countdownFinished: false
    }
  ]);
  const [currentUser, setCurrentUser] = useState(""); // State to store current user
  const { darkMode } = useTheme(); // Get darkMode state from the theme context

  // Simulate user login (replace with actual authentication)
  useEffect(() => {
    // Simulate user login (replace with actual authentication)
    setCurrentUser("User123");
  }, []);

// Function to handle user registration for auction
const handleRegister = (auctionId) => {
    // Find the auction by ID
    const auctionIndex = auctions.findIndex(auction => auction.id === auctionId);
    if (auctionIndex !== -1) {
      // Check if the auction has started (countdownFinished)
      if (!auctions[auctionIndex].countdownFinished) {
        // Check if the user is already registered
        if (!auctions[auctionIndex].registeredUsers.includes(currentUser)) {
          // If the user is not registered, add them to the registeredUsers array
          setAuctions(prevAuctions => {
            const updatedAuctions = [...prevAuctions];
            updatedAuctions[auctionIndex].registeredUsers.push(currentUser);
            return updatedAuctions;
          });
        }
      }
    }
  };
  

  // Function to calculate time left for the auction
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

  // Update countdown every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setAuctions(prevAuctions => {
        return prevAuctions.map(auction => {
          const timeLeft = calculateTimeLeft(auction.endTime);
          if (timeLeft.hours <= 0 && timeLeft.minutes <= 0 && timeLeft.seconds <= 0) {
            return { ...auction, countdownFinished: true };
          }
          return auction;
        });
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

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
                  Starts In: {auction.countdownFinished ? "Auction Started" : `${calculateTimeLeft(auction.endTime).hours}h ${calculateTimeLeft(auction.endTime).minutes}m ${calculateTimeLeft(auction.endTime).seconds}s`}
                </p>
                {auction.registeredUsers.includes(currentUser) ? (
                  <button className="start-bidding-btn" disabled={!auction.countdownFinished}>Start Bidding</button>
                ) : (
                  <button className="register-btn" onClick={() => handleRegister(auction.id)}>Register</button>
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