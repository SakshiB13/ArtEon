import React, { useState } from 'react';
import { useGlobalState, setGlobalState, setLoadingMsg, setAlert } from '../store';
import { createAuctions } from '../utils/auction';
import { FaTimes } from 'react-icons/fa';
import web3 from 'web3'; // Import web3

const StartAuction = () => {
  const [modal] = useGlobalState('startAuctionModal');
  //console.log('Modal state:', modal);
  const [nft] = useGlobalState('nft');
  console.log('NFT:', nft);
  const [price, setPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const connectedAccount = useGlobalState('connectedAccount');
  const [auctionDuration, setAuctionDuration] = useState(5); // Default duration of 5 minutes

  const handleAuctionDurationChange = (e) => {
    setAuctionDuration(parseInt(e.target.value));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!price || !startDate || !auctionDuration) {
      setAlert('Please fill in all auction details', 'red');
      return;
    }

    const startPriceWei = web3.utils.toWei(price.toString(), 'ether');

    // Convert start time and end time to Unix timestamp (in seconds)
    const startTimeUnix = Math.floor(new Date(startDate).getTime() / 1000);
    const endTimeUnix = startTimeUnix + auctionDuration * 60;
    const seller = connectedAccount[0];

    setGlobalState('modal', 'scale-0');
    setGlobalState('loading', { show: true, msg: 'Initiating auction...' });

    try {
      setLoadingMsg('Starting auction...');
      setGlobalState('startAuctionModal', 'scale-0');

      // const auctionResult = await createAuction({
      //   tokenId: nft.id,
      //   price: startPriceWei,
      //   startDate: startTimeUnix,
      //   endDate: endTimeUnix,
      // });

      const auctionData = {
        tokenId: nft.id,
        startPrice: startPriceWei,
        startTime: startTimeUnix,
        endTime: endTimeUnix,
        seller:seller,
        active: true,
        metadataURI: nft.metadataURI,
        name: nft.title,
        currentBid: 'N/A',
        currentBidder: '0'
      };

     
      const dbAuction = await createAuctions(auctionData);

      if (dbAuction) {
        setAlert('Auction created successfully', 'green');
        window.location.reload();
      } else {
        setAlert('Failed to create auction', 'red');
      }
    } catch (error) {
      console.log('Error starting auction: ', error);
      setAlert('Failed to start auction', 'red');
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center
      justify-center bg-black bg-opacity-50 transform
      transition-transform duration-300 ${modal}`}
    >
      <div className="bg-[#151c25] shadow-xl shadow-[#e32970] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold text-gray-400">{nft?.title}</p>
            <button
              type="button"
              onClick={() => setGlobalState('startAuctionModal', 'scale-0')}
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          <div className="flex flex-row justify-center items-center rounded-xl mt-5">
            <div className="shrink-0 rounded-xl overflow-hidden h-20 w-20">
              <img
                alt={nft?.title}
                src={nft?.metadataURI}
                className="h-full w-full object-cover cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <input
              className="block w-full text-sm
              text-slate-500 bg-transparent border-0
              focus:outline-none focus:ring-0"
              type="number"
              step={0.01}
              min={0.01}
              name="price"
              placeholder="Minimum Price (Eth)"
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <input
              className="block w-full text-sm
              text-slate-500 bg-transparent border-0
              focus:outline-none focus:ring-0"
              type="datetime-local"
              name="startDate"
              placeholder="Start Date"
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
                <select
                  className="block w-full text-sm text-slate-500 bg-transparent border-0 focus:outline-none focus:ring-0"
                  name="auctionDuration"
                  onChange={handleAuctionDurationChange}
                  value={auctionDuration}
                  required
                >
                  {[2, 5, 6, 7, 8, 9, 10].map((duration) => (
                    <option key={duration} value={duration}>
                      {duration} minutes
                    </option>
                  ))}
                </select>
              </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="flex flex-row justify-center items-center
            w-full text-white text-md bg-[#e32970]
            hover:bg-[#bd255f] py-2 px-5 rounded-full
            drop-shadow-xl border border-transparent
            hover:bg-transparent hover:text-[#e32970]
            hover:border hover:border-[#bd255f]
            focus:outline-none focus:ring mt-5"
          >
            Start Auction
          </button>
        </form>
      </div>
    </div>
  );
};

export default StartAuction;