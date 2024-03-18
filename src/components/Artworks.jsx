import { useEffect, useState } from 'react'
import { setGlobalState, useGlobalState } from '../store'
import { useLocation } from 'react-router-dom';

const Artworks = () => {
  const [nfts] = useGlobalState('nfts')
  const [end, setEnd] = useState(4)
  const [count] = useState(4)
  const [collection, setCollection] = useState([])
  const location = useLocation(); // Get current location

  const getCollection = () => {
    return location.pathname === "/market" ? nfts : nfts.slice(0, end)
  }

  useEffect(() => {
    setCollection(getCollection())
  }, [nfts, end, location.pathname])

  return (
    <div className="bg-[#151c25] gradient-bg-artworks">
      <div className="w-4/5 py-10 mx-auto">
        <h4 className="text-white text-3xl font-bold uppercase text-gradient">
          {location.pathname === "/market" ? 'Browse Marketplace' : (collection.length > 0 ? 'Latest Artworks' : 'No Artworks Yet')}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-3 py-2.5">
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
  )
}

const Card = ({ nft }) => {
  const [auctions] = useGlobalState('auctions');
  const auctionItem = auctions.find(auction => auction.tokenId === nft?.id);
  const currentTime = Math.floor(Date.now() / 1000);
  const endTime = parseInt(auctionItem?.endTime);
  const isAuctionActive = auctionItem && currentTime < endTime;

  const setNFT = () => {
    setGlobalState('nft', nft)
    setGlobalState('showModal', 'scale-100')
  }

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
      <h4 className="text-white font-semibold">{nft.title}</h4>
      <p className="text-gray-400 text-xs my-1">{nft.description}</p>
      <div className="flex justify-between items-center mt-3 text-white">
        <div className="flex flex-col">
          <small className="text-xs">{isAuctionActive ? 'Current Highest Bid' : 'Current Price'}</small>
          <p className="text-sm font-semibold">
            {isAuctionActive ? (auctionItem?.currentBid || 'N/A') : (nft.cost + ' ETH')}
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
  )
}

export default Artworks;