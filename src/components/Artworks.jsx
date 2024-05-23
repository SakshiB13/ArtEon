import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalState, setGlobalState } from '../store';
import { FiHeart } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';
import { useTheme } from './themeContext';
import { getAllAuctions } from '../utils/auction';

const Artworks = ()  => {

  useEffect(() => {
    const fetchData = async () => {
      
      const auctions = await getAllAuctions();
      setGlobalState('auctions', auctions)
    };

    fetchData();
  }, []);
  const [nfts] = useGlobalState('nfts');
  const [auctions] = useGlobalState('auctions');
  console.log(auctions);
  const [end, setEnd] = useState(4);
  const [collection, setCollection] = useState([]);
  const location = useLocation();
  const { darkMode } = useTheme();

  // Function to filter NFTs not in auctions
  const getCollection = () => {
    const auctionedTokenIds = auctions.map(auction => auction.tokenId);
    const filteredNFTs = nfts.filter(nft => !auctionedTokenIds.includes(nft.id) && !nft.listedForSale);
    return location.pathname === "/market" ? filteredNFTs : filteredNFTs.slice(0, end);
  };

  useEffect(() => {
    setCollection(getCollection());
  }, [nfts, auctions, end, location.pathname]);

  return (
    <div className={`${darkMode ? 'bg-[#F8F0E3]' : 'bg-[#151c25] gradient-bg-artworks'}`}>
      <div className="w-4/5 py-10 mx-auto">
        <h4 className={`text-3xl font-bold uppercase ${darkMode ? 'text-black' : 'text-white text-gradient'}`}>
          {location.pathname === "/market" ? 'Browse Marketplace' : (collection.length > 0 ? 'Latest Artworks' : 'No Artworks Yet')}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-3 py-2.5">
          {collection.map((nft, i) => (
            <Card key={i} nft={nft} darkMode={darkMode} />
          ))}
        </div>
        {location.pathname !== "/market" && collection.length > 0 && nfts.length > collection.length && (
          <div className="text-center my-5">
            <a href="/market">
              <button className="shadow-xl shadow-black text-white bg-[#e32970] hover:bg-[#bd255f] rounded-full cursor-pointer p-2">
                View all
              </button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const Card = ({ nft, darkMode }) => {
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
    <div className={`relative w-full shadow-xl shadow-black rounded-md overflow-hidden my-2 p-3 ${darkMode ? ' bg-[#800080]' : 'bg-gray-800'}`}>
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
          <small className="text-xs">Current Price</small>
          <p className="text-sm font-semibold">{`${nft.cost} ETH`}</p>
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
