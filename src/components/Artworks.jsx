import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalState } from '../store'; // Add import for useGlobalState
import { FiHeart } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';
import { useTheme } from './themeContext';

const Artworks = () => {
  const [nfts] = useGlobalState('nfts'); // Add nfts state
  const [end, setEnd] = useState(4);
  const [count] = useState(4);
  const [collection, setCollection] = useState([]);
  const location = useLocation();
  const { darkMode } = useTheme();

  const getCollection = () => {
    return location.pathname === "/market" ? nfts : nfts.slice(0, end);
  };

  useEffect(() => {
    setCollection(getCollection());
  }, [nfts, end, location.pathname]);

  return (
    <div className={` ${darkMode ? 'bg-[#F8F0E3]' : 'bg-[#151c25] gradient-bg-artworks'}`}>
      <div className="w-4/5 py-10 mx-auto">
        <h4 className={`text-3xl font-bold uppercase  ${darkMode ? 'bg-[#F8F0E3]' : 'text-white text-gradient'}`}>
          {location.pathname === "/market" ? 'Browse Marketplace' : (collection.length > 0 ? 'Latest Artworks' : 'No Artworks Yet')}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-3 py-2.5 dark:bg-white">
          {collection.map((nft, i) => (
            <Card key={i} nft={nft} />
          ))}
        </div>

        {location.pathname !== "/market" && collection.length > 0 && nfts.length > collection.length && (
          <div className="text-center my-5">
            <a href='/market'>
              <button
                className="shadow-xl shadow-black text-white bg-[#e32970] hover:bg-[#bd255f] rounded-full cursor-pointer p-2"
              >
                View all
              </button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const Card = ({ nft }) => {
  const [auctions] = useGlobalState('auctions');
  const auctionItem = auctions.find(auction => auction.tokenId === nft?.id);
  const currentTime = Math.floor(Date.now() / 1000);
  const endTime = parseInt(auctionItem?.endTime);
  const startTime = parseInt(auctionItem?.startTime);
  const isAuctionActive = auctionItem?.active && currentTime < endTime && currentTime >= startTime;

  const setNFT = () => {
    setGlobalState('nft', nft);
    setGlobalState('showModal', 'scale-100');
  };

  const LikeButton = ({ initialCount = 0 }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(initialCount);

    const toggleLike = () => {
      const newCount = liked ? likeCount - 1 : likeCount + 1;
      setLikeCount(newCount);
      setLiked(!liked);
    };

    return (
      <button onClick={toggleLike} className="flex items-center space-x-2">
        {liked ? (
          <AiFillHeart className="text-red-500 text-xl" />
        ) : (
          <FiHeart className="text-xl" />
        )}
        <span className="text-white">{likeCount}</span>
      </button>
    );
  };

  return (
    <div className="relative w-full shadow-xl shadow-black rounded-md overflow-hidden bg-gray-800 my-2 p-3">
      {isAuctionActive && (
        <div className="absolute top-0 right-0 bg-red-500 text-white font-semibold py-1 px-3 rounded-tr-md rounded-bl-md">
          On Auction
        </div>
      )}
      <img
        src={nft.metadataURI}
        alt={nft.title}
        className="h-60 w-full object-cover shadow-lg shadow-black rounded-lg mb-3"
      />
      <div className="flex justify-between items-center">
        <h4 className="text-white font-semibold flex-1">{nft.title}</h4>
        <LikeButton initialCount={nft.likes || 0} />
      </div>
      <p className="text-gray-400 text-xs my-1">{nft.description}</p>
      <div className="flex justify-between items-center mt-3 text-white">
        <div className="flex flex-col">
          <small className="text-xs">{isAuctionActive && auctionItem?.currentBid!=0 ? 'Current Highest Bid' : 'Current Price'}</small>
          <p className="text-sm font-semibold">
            {isAuctionActive && auctionItem?.currentBid !=0  ? (auctionItem?.currentBid + ' ETH') : (nft.cost + ' ETH')}
          </p>
        </div>
        <button
          className="shadow-lg shadow-black text-white text-sm bg-[#e32970] hover:bg-[#bd255f] cursor-pointer rounded-full px-1.5 py-1"
          onClick={setNFT}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default Artworks;
