import React, { useState } from 'react';
import Identicon from 'react-identicons';
import { FaTimes } from 'react-icons/fa';
import { useGlobalState, setGlobalState, truncate, setAlert } from '../store';
import { buyNFT , listForSale} from '../Blockchain.Services';

const ShowNFT = () => {
  const [showModal] = useGlobalState('showModal');
  //const [startAuctionModal] = useGlobalState('startAuctionModal');
  const [connectedAccount] = useGlobalState('connectedAccount');
  const [nft] = useGlobalState('nft');
  const [auctions] = useGlobalState('auctions');
  const userType = useGlobalState("usertype");
  console.log(userType);
  
  const auctionItem = auctions.find(auction => auction.tokenId === nft?.id);
  const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
  const endTime = parseInt(auctionItem?.endTime);
  const startTime = parseInt(auctionItem?.startTime);

  // Convert start time and end time to standard time format
  const startDate = new Date(startTime * 1000).toLocaleString();
  const endDate = new Date(endTime * 1000).toLocaleString();

  const onChangePrice = () => {
    setGlobalState('showModal', 'scale-0');
    setGlobalState('updateModal', 'scale-100');
  };

  const onStartAuction = () => {
     setGlobalState('showModal', 'scale-0');
     //console.log("before");
     //console.log(startAuctionModal);
     setGlobalState('startAuctionModal', 'scale-100');
     //console.log("after");
     //console.log(startAuctionModal);
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

  const handleListForSale = async () => {
    setGlobalState('showModal', 'scale-0');
    setGlobalState('loading', {
      show: true,
      msg: 'Initializing Listing process...',
    });

    try {
      await listForSale({id: nft?.id, price: nft?.cost});
      setAlert('NFT Listed for Sale...', 'green');
      window.location.reload();
    } catch (error) {
      console.log('Error listing NFT: ', error);
      setAlert('Listing failed...', 'red');
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
                {auctionItem?.active && auctionItem?.currentBid !== 0 ? (
                  <>
                    <small className="text-xs">Current Highest Bid:</small>
                    <p className="text-sm font-semibold">{auctionItem?.currentBid} ETH</p>
                  </>
                ) : (
                  <>
                    <small className="text-xs">Current Price:</small>
                    <p className="text-sm font-semibold">{nft?.cost} ETH</p>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center space-x-2">
            {connectedAccount === nft?.owner && userType[0].collectionName === 'artist' ? (
              nft?.listedForSale === false ? (
                 <button
                className="flex flex-row justify-center items-center
                  w-full text-[#e32970] text-md border-[#e32970]
                  py-2 px-5 rounded-full bg-transparent 
                  drop-shadow-xl border hover:bg-[#bd255f]
                  hover:bg-transparent hover:text-white
                  hover:border hover:border-[#bd255f]
                  focus:outline-none focus:ring mt-5"
                onClick={handleListForSale}
              >
              List For Sale
              </button>
              ): auctionItem?.active && currentTime < endTime ? (
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
              ) : (
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
                    onClick={onStartAuction}
                  >
                    Start Auction 
                  </button>
                </>
              )
            ) : (
              connectedAccount === nft?.owner && userType[0].collectionName === 'collector' ? ( <></>): (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowNFT;
 