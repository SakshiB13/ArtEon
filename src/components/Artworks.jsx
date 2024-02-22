import React, { useState } from 'react';
import { setGlobalState } from '../store';

const Card = ({ nft }) => {
  const setNFT = () => {
    setGlobalState('nft', nft);
    setGlobalState('showModal', 'scale-100');
  };

  // State variables for like count and whether the user has liked the artwork
   const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Function to handle liking functionality
  const handleLike = () => {
    if (!isLiked) {
      setLikeCount(likeCount + 1);
      setIsLiked(true);
    }
  }; 

  return (
    <div className="w-full shadow-xl shadow-black rounded-md overflow-hidden bg-gray-800 my-2 p-3">
      <img
        src={nft.metadataURI}
        alt={nft.title}
        className="h-60 w-full object-cover shadow-lg shadow-black rounded-lg mb-3"
      />
      <h4 className="text-white font-semibold">{nft.title}</h4>
      <p className="text-gray-400 text-xs my-1">{nft.description}</p>
      <div className="flex justify-between items-center mt-3 text-white">
        <div className="flex flex-col">
          <small className="text-xs">Current Price</small>
          <p className="text-sm font-semibold">{nft.cost} ETH</p>
        </div>

        
        <button
          className={`shadow-lg shadow-black text-white text-sm ${
            isLiked ? 'bg-red-500' : 'bg-[#e32970]'
          } hover:bg-[#bd255f] cursor-pointer rounded-full px-1.5 py-1`}
          onClick={handleLike}
        >
          {isLiked ? 'Liked' : 'Like'} ({likeCount})
        </button> 

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

export default Card;
