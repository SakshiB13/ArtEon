import React, { useState } from 'react';
import Identicon from 'react-identicons';
import { FaTimes } from 'react-icons/fa';
import { useGlobalState, setGlobalState, truncate, setAlert } from '../store';
import { buyNFT, endAuction ,placeBid} from '../Blockchain.Services';

const ShowNFT = () => {
  const [showModal] = useGlobalState('showModal');
  const [connectedAccount] = useGlobalState('connectedAccount');
  const [nft] = useGlobalState('nft');
  const [auctions] = useGlobalState('auctions');
  const [bid, setBid] = useState('');
  //if (bid) console.log(bid);
/* const isNFTInAuction = auctions.some(auctionItem => auctionItem.tokenId === nft?.id); */
const auctionItem = auctions.find(auction => auction.tokenId === nft?.id);
  //console.log(auctions);
  console.log(auctionItem);
  const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
  const endTime = parseInt(auctionItem?.endTime);
  const startTime = parseInt(auctionItem?.startTime);

    console.log(currentTime, endTime);
    // Convert start time and end time to standard time format
    const startDate = new Date(startTime * 1000).toLocaleString();
    const endDate = new Date(endTime * 1000).toLocaleString();
    

  const onChangePrice = () => {
    setGlobalState('showModal', 'scale-0');
    setGlobalState('updateModal', 'scale-100');
  };
  const onEndAuction = async() => {
    const auctionEnded = await endAuction(auctionItem?.id);
    if (auctionEnded) {
        console.log("Auction ended!", auctionEnded);
     
    }
  };

  const onstartauction = () => {
    setGlobalState('showModal', 'scale-0');
    setGlobalState('startAuctionModal','scale-100');
  };

  const handleNFTPurchase = async () => {
    setGlobalState('showModal', 'scale-0');
    setGlobalState('loading', {
      show: true,
      msg: 'Initializing NFT transfer...',
    });

    try {
      await buyNFT(nft);
      setAlert('Transfer completed...', 'green');
      window.location.reload();
    } catch (error) {
      console.log('Error transferring NFT: ', error);
      setAlert('Purchase failed...', 'red');
    }
  };

  const onplacebid = async () => {
    try {
      const bidAmount = bid;
      const success = await placeBid(auctionItem?.id, bidAmount);
      if (success) {
        console.log('Bid successfully placed.');
        setAlert('Your Bid has been placed!', 'green');
      } else {
        console.log('Failed to place bid.');
        setAlert('Failed to place your bid', 'red');
      }
    } catch (error) {
      console.error('Error placing bid:', error);
      // Handle the error case
    }
  };
  

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center
          justify-center bg-black bg-opacity-50 transform
          transition-transform duration-300 ${showModal}`}
    >
      <div className="bg-[#151c25] shadow-xl shadow-[#e32970] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold text-gray-400">Buy NFT</p>
            <button
              type="button"
              onClick={() => setGlobalState('showModal', 'scale-0')}
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          <div className="flex flex-row justify-center items-center rounded-xl mt-5">
            <div className="shrink-0 rounded-xl overflow-hidden h-40 w-40">
              <img
                className="h-full w-full object-cover cursor-pointer"
                src={nft?.metadataURI}
                alt={nft?.title}
              />
            </div>
          </div>

          <div className="flex flex-col justify-start rounded-xl mt-5">
            <h4 className="text-white font-semibold">{nft?.title}</h4>
            <p className="text-gray-400 text-xs my-1">{nft?.description}</p>

            <div className="flex justify-between items-center mt-3 text-white">
              <div className="flex justify-start items-center">
                <Identicon
                  string={nft?.owner}
                  size={50}
                  className="h-10 w-10 object-contain rounded-full mr-3"
                />
                <div className="flex flex-col justify-center items-start">
                  <small className="text-white font-bold">@owner</small>
                  <small className="text-pink-800 font-semibold">
                    {nft?.owner ? truncate(nft.owner, 4, 4, 11) : '...'}
                  </small>
                </div>
              </div>

              <div className="flex flex-col">
              {auctionItem?.active ? (
                <>
                <small className="text-xs">Current Highest Bid:</small>
                
                <p className="text-sm font-semibold"> {auctionItem?.currentBid} ETH</p>
                </>
                ):
                (
                  <>
                  <small className="text-xs">Current Price:</small>
                  <p className="text-sm font-semibold">{nft?.cost} ETH</p>
                  </>
                ) }
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center space-x-2">
          {connectedAccount === nft?.owner ? (
  // Check if the NFT is present in the auction array
  auctionItem?.active  && currentTime < endTime ? (
    // If the NFT is present in the auction array, render only the Change Price button
    <>
    <button
      className="flex flex-row justify-center items-center
      w-full text-[#e32970] text-md border-[#e32970]
      py-2 px-5 rounded-full bg-transparent 
      drop-shadow-xl border hover:bg-[#bd255f]
      hover:bg-transparent hover:text-white
      hover:border hover:border-[#bd255f]
      focus:outline-none focus:ring mt-5"
      onClick={onChangePrice}
    >
      Change Price
    </button> 
    <p className="font-semibold text-gray-400">Auction ends on {endDate}</p>
    </>
  ) : auctionItem && currentTime >= endTime?  (
    <>
    <p className="font-semibold text-gray-400">Auction ended on {endDate}</p>
      <button
        className="flex flex-row justify-center items-center
        w-full text-[#e32970] text-md border-[#e32970]
        py-2 px-5 rounded-full bg-transparent 
        drop-shadow-xl border hover:bg-[#bd255f]
        hover:bg-transparent hover:text-white
        hover:border hover:border-[#bd255f]
        focus:outline-none focus:ring mt-5"
        onClick={onChangePrice}
      >
        Change Price
      </button>
      <button
        className="flex flex-row justify-center items-center
        w-full text-[#e32970] text-md border-[#e32970]
        py-2 px-5 rounded-full bg-transparent 
        drop-shadow-xl border hover:bg-[#bd255f]
        hover:bg-transparent hover:text-white
        hover:border hover:border-[#bd255f]
        focus:outline-none focus:ring mt-5"
        onClick={onEndAuction}
      >
        End Auction 
      </button>
    </>
  ): (
    // If the NFT is not present in the auction array, render both the Change Price and Start Auction buttons
    <>
      <button
        className="flex flex-row justify-center items-center
        w-full text-[#e32970] text-md border-[#e32970]
        py-2 px-5 rounded-full bg-transparent 
        drop-shadow-xl border hover:bg-[#bd255f]
        hover:bg-transparent hover:text-white
        hover:border hover:border-[#bd255f]
        focus:outline-none focus:ring mt-5"
        onClick={onChangePrice}
      >
        Change Price
      </button>
      <button
        className="flex flex-row justify-center items-center
        w-full text-[#e32970] text-md border-[#e32970]
        py-2 px-5 rounded-full bg-transparent 
        drop-shadow-xl border hover:bg-[#bd255f]
        hover:bg-transparent hover:text-white
        hover:border hover:border-[#bd255f]
        focus:outline-none focus:ring mt-5"
        onClick={onstartauction}
      >
        Start Auction 
      </button>
    </>
  )
  ) : (
    auctionItem && currentTime < endTime && currentTime >= startTime ?  (
    // Render just the Place Bid button if auction is active

  // If the owner is not the connected account, render the Purchase Now and Start Bidding buttons
    <>
    <input
      className="block w-full text-sm text-slate-500 bg-transparent border-0 focus:outline-none focus:ring-0"
      type="number"
      step={0.01}
      min={0.01}
      name="bid"
      placeholder="Place a bid higher than the current price"
      onChange={(e) => setBid(e.target.value)}
      value={bid}
      required
    />
    
    <button
      className="flex flex-row justify-center items-center
      w-full text-white text-md bg-[#e32970]
      hover:bg-[#bd255f] py-2 px-5 rounded-full
      drop-shadow-xl border border-transparent
      hover:bg-transparent hover:text-[#e32970]
      hover:border hover:border-[#bd255f]
      focus:outline-none focus:ring mt-5"
      onClick={onplacebid}
    >
     Place a Bid
    </button>
    </>
    ):(
    <>
    <button
      className="flex flex-row justify-center items-center
      w-full text-white text-md bg-[#e32970]
      hover:bg-[#bd255f] py-2 px-5 rounded-full
      drop-shadow-xl border border-transparent
      hover:bg-transparent hover:text-[#e32970]
      hover:border hover:border-[#bd255f]
      focus:outline-none focus:ring mt-5"
      onClick={handleNFTPurchase}
    >
      Purchase Now
    </button>
  </>
  )
)}
</div>
   

        </div>
      </div>
      
    </div>
  );
};

export default ShowNFT;
