import React, { useState, useEffect } from 'react';

const Chatbox = ({ auctionId, currentUser, onClose, auctionEndTime, auction }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  console.log(auction);
  const [timer, setTimer] = useState(Math.floor((auction.endTime * 1000 - new Date().getTime()) / 1000));
  const [highestBid, setHighestBid] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);
  const [showLoserMessage, setShowLoserMessage] = useState(false);
  const startingBid = parseFloat(auction.startingBid);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer(prevTimer => prevTimer - 1);
    }, 1000);

    return () => clearInterval(countdown);
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

  const handleSendMessage = () => {
    if (isNumeric(newMessage.trim())) {
      const bidAmount = parseFloat(newMessage.trim());
      if (bidAmount >= parseFloat(window.web3.utils.fromWei(auction.startPrice.toString(), 'ether'))) { // Check if bid is higher than or equal to starting bid
        if (bidAmount > highestBid) {
          setHighestBid(bidAmount);
          const messageData = {
            text: ` ${currentUser} placed a bid of ${bidAmount}`,
            sender: currentUser,
            timestamp: Date.now()
          };
          setMessages(prevMessages => [...prevMessages, messageData]);
          setErrorMessage('');
        } else {
          setErrorMessage('Your bid must be higher than the current highest bid.');
        }
      } else {
        setErrorMessage('Your bid must be higher than or equal to the starting bid.');
      }
    } else {
      setErrorMessage('Please enter a numerical value for your bid.');
    }
    setNewMessage('');
  };
  

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours > 0 ? hours + "h " : ""}${minutes > 0 ? minutes + "m " : ""}${seconds}s`;
  };

  return (
    <div className="chatbox-container">
      <div className="chatbox">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender === currentUser ? 'sent' : 'received'}`}>
              <span className="text">{message.text}</span>
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            placeholder="Place your bid..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Place Bid</button>
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="info">
          <div className="timer">Time Remaining: {formatTime(timer)}</div>
          <div className="highest-bid">Current Highest Bid: {highestBid}</div>
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
