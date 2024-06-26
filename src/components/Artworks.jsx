import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalState, setGlobalState } from '../store';
/* import { FiHeart } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai'; */
import { useTheme } from './themeContext';
import { getAllAuctions } from '../utils/auction';

const Artworks = () => {
  const [connectedAccount] = useGlobalState('connectedAccount');

  useEffect(() => {
    const fetchData = async () => {
      const auctions = await getAllAuctions();
      setGlobalState('auctions', auctions);
    };

    fetchData();
  }, []);
  
  const [nfts] = useGlobalState('nfts');
  const [auctions] = useGlobalState('auctions');
  const [end, setEnd] = useState(4);
  const [listedCollection, setListedCollection] = useState([]);
  const [unlistedCollection, setUnlistedCollection] = useState([]);
  const location = useLocation();
  const { darkMode } = useTheme();

  // Function to filter NFTs not in auctions
  const getListedCollection = () => {
    const auctionedTokenIds = auctions.map(auction => auction.tokenId);
    return nfts.filter(nft => nft.listedForSale === true && !auctionedTokenIds.includes(nft.id));
  };

  // Function to filter NFTs that are not listed for sale
  const getUnlistedCollection = () => {
    return nfts.filter(nft => nft.listedForSale === false);
  };

  // Function to filter unlisted NFTs owned by connectedAccount
  const getOwnedUnlistedNFTs = () => {
    return nfts.filter(nft => nft.listedForSale === false && nft.owner === connectedAccount);
  };

  useEffect(() => {
    setListedCollection(getListedCollection());
    //setUnlistedCollection(getUnlistedCollection());
  }, [nfts, auctions, end, location.pathname]);

  const displayedListedNFTs = location.pathname === "/market" ? listedCollection : listedCollection.slice(0, end);
  //const displayedUnlistedNFTs = location.pathname === "/market" ? unlistedCollection : [];
  const ownedUnlistedNFTs = location.pathname === "/market" ? getOwnedUnlistedNFTs() : [];

  return (
    <div className={`${darkMode ? 'bg-[#F8F0E3]' : 'bg-[#151c25] gradient-bg-artworks'}`}>
      <div className="w-4/5 py-10 mx-auto">
        {location.pathname === "/market" && ownedUnlistedNFTs.length > 0 && (
          <div>
            <h4 className={`text-3xl font-bold uppercase ${darkMode ? 'text-black' : 'text-white text-gradient'}`}>
              Your Unlisted NFTs
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-3 py-2.5">
              {ownedUnlistedNFTs.map((nft, i) => (
                <Card key={i} nft={nft} darkMode={darkMode} />
              ))}
            </div>
          </div>
        )}
        <h4 className={`text-3xl font-bold uppercase ${darkMode ? 'text-black' : 'text-white text-gradient'}`}>
          {location.pathname === "/market" ? 'Browse Marketplace' : (displayedListedNFTs.length > 0 ? 'Latest Artworks' : 'No Artworks Yet')}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-3 py-2.5">
          {displayedListedNFTs.map((nft, i) => (
            <Card key={i} nft={nft} darkMode={darkMode} />
          ))}
         
        </div>
        {location.pathname !== "/market" && listedCollection.length > 0 && nfts.length > listedCollection.length && (
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

  return (
    <div className={`relative w-full shadow-xl shadow-black rounded-md overflow-hidden my-2 p-3 ${darkMode ? ' bg-[#800080]' : 'bg-gray-600'}`}>
      <img
        src={nft.metadataURI}
        alt={nft.title}
        className="h-60 w-full object-cover shadow-lg shadow-black rounded-lg mb-3"
      />
      <div className="flex justify-between items-center">
        <h4 className="text-white font-semibold flex-1">{nft.title}</h4>
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
