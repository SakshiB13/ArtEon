import React, { useState } from 'react';
import { useGlobalState, setGlobalState, setLoadingMsg, setAlert } from '../store';
import { FaTimes } from 'react-icons/fa';
import { mintNFT } from '../Blockchain.Services'; // Removed createAuction import
import { uploadFileToIPFS } from '../utils/hashing.js';
import { createAuctions } from '../utils/auction';
import web3 from 'web3'; // Ensure web3 is imported if not already

const CreateNFT = () => {
  const [modal] = useGlobalState('modal');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [imgBase64, setImgBase64] = useState(null);
  const [mintednfts] = useGlobalState('nfts');
  const [isAuction, setIsAuction] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const connectedAccount = useGlobalState('connectedAccount');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !imgBase64) return;

    const startPriceWei = web3.utils.toWei(price.toString(), 'ether');
    const startTimeUnix = Math.floor(new Date(startDate).getTime() / 1000);
    const endTimeUnix = Math.floor(new Date(endDate).getTime() / 1000);

    setGlobalState('modal', 'scale-0');
    setGlobalState('loading', { show: true, msg: 'Uploading IPFS data...' });

    try {
      const uploadResponse = await uploadFileToIPFS(fileUrl);
      if (uploadResponse.success) {
        const metadataURI = uploadResponse.pinataURL;

        if (!isAuction) {
          if (!price) {
            setAlert('Please enter a price for minting', 'red');
            return;
          }
        } else {
          if (!price || !startDate || !endDate) {
            setAlert('Please fill in all auction details', 'red');
            return;
          }
        }

        setLoadingMsg('Verifying Art...');

        let exists = false;
        if (mintednfts) {
          for (let i = 0; i < mintednfts.length; i++) {
            if (mintednfts[i].metadataURI === metadataURI) {
              exists = true;
              break;
            }
          }
        }

        if (exists) {
          setAlert('Minting failed - Artwork already minted', 'red');
        } else {
          setLoadingMsg('Initializing transaction...');
          setFileUrl(metadataURI);
          
          // Mint the NFT and get the tokenId
          const tokenId = await mintNFT({ title, description, metadataURI, price });
          
          if (tokenId) {
          //   // Get the seller's address
          //   const web3 = new web3(window.ethereum);
          // const accounts = await web3.eth.requestAccounts();
          const seller = connectedAccount[0];
            
            if (isAuction) {
              const auctionData = {
                tokenId: tokenId,
                startPrice: startPriceWei,
                startTime: startTimeUnix,
                endTime: endTimeUnix,
                seller: seller,
                active: true,
                metadataURI: metadataURI,
                name: title,
                currentBid: 'N/A',
                currentBidder: '0'
              };

              setLoadingMsg('Creating Auction...');
              const dbAuction = await createAuctions(auctionData);
              
              if (dbAuction) {
                resetForm();
                setAlert('Auction created successfully', 'green');
                window.location.reload();
              } else {
                setAlert('Failed to create auction', 'red');
              }
            } else {
              resetForm();
              setAlert('Minting completed...', 'green');
              window.location.reload();
            }
          }
        }
      }
    } catch (error) {
      console.log('Error uploading file: ', error);
      setAlert('Minting failed...', 'red');
    }
  };

  const changeImage = async (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);

    reader.onload = (readerEvent) => {
      const file = readerEvent.target.result;
      setImgBase64(file);
      setFileUrl(e.target.files[0]);
    };
  };

  const closeModal = () => {
    setGlobalState('modal', 'scale-0');
    resetForm();
  };

  const resetForm = () => {
    setFileUrl('');
    setImgBase64(null);
    setTitle('');
    setPrice('');
    setDescription('');
    setStartDate('');
    setEndDate('');
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
            <p className="font-semibold text-gray-400">Add NFT</p>
            <button
              type="button"
              onClick={closeModal}
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          <div className="flex flex-row justify-center items-center rounded-xl mt-5">
            <div className="shrink-0 rounded-xl overflow-hidden h-20 w-20">
              <img
                alt="NFT"
                className="h-full w-full object-cover cursor-pointer"
                src={
                  imgBase64 ||
                  'https://img.freepik.com/free-photo/multi-colored-butterfly-flies-among-vibrant-nature-beauty-generated-by-ai_188544-19743.jpg?w=740&t=st=1697629772~exp=1697630372~hmac=b368ef612bf3e73809494313735de8ebd37eea2d546e0afd0be03ecc02c5f385'
                }
              />
            </div>
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
              <input
                type="file"
                accept="image/png, image/gif, image/jpeg, image/webp"
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-[#19212c] file:text-gray-400
                  hover:file:bg-[#1d2631]
                  cursor-pointer focus:ring-0 focus:outline-none"
                onChange={changeImage}
                required
              />
            </label>
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <input
              className="block w-full text-sm
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0"
              type="text"
              name="title"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              required
            />
          </div>

          {isAuction ? (
            <>
              <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
                <input
                  className="block w-full text-sm text-slate-500 bg-transparent border-0 focus:outline-none focus:ring-0"
                  type="number"
                  step={0.01}
                  min={0.01}
                  name="price"
                  placeholder="Minimum Price (Eth)"
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                  required
                />
              </div>

              <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
                <input
                  className="block w-full text-sm text-slate-500 bg-transparent border-0 focus:outline-none focus:ring-0"
                  type="datetime-local"
                  name="startDate"
                  placeholder="Start Date"
                  onChange={(e) => setStartDate(e.target.value)}
                  value={startDate}
                  required
                />
              </div>

              <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
                <input
                  className="block w-full text-sm text-slate-500 bg-transparent border-0 focus:outline-none focus:ring-0"
                  type="datetime-local"
                  name="endDate"
                  placeholder="End Date"
                  onChange={(e) => setEndDate(e.target.value)}
                  value={endDate}
                  required
                />
              </div>
            </>
          ) : (
            <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
              <input
                className="block w-full text-sm
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0"
                type="number"
                step={0.01}
                min={0.01}
                name="price"
                placeholder="Price (Eth)"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                required
              />
            </div>
          )}

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <textarea
              className="block w-full text-sm resize-none
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0 h-20"
              type="text"
              name="description"
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="flex flex-row justify-center items-center
              w-full text-white text-md bg-[#800080] hover:bg-[#b300b3] py-2 px-5 rounded-full
              drop-shadow-xl border border-transparent
              hover:bg-transparent hover:text-[#800080]
              hover:border hover:border-[#b300b3]
              focus:outline-none focus:ring mt-5"
          >
            Mint Now
          </button>
 {/* Toggle button to switch between minting and auction */}
 <div className="flex flex-row justify-center items-center mt-3">
            <div
              onClick={() => setIsAuction(!isAuction)}
              className={`w-12 h-6 rounded-full cursor-pointer bg-gray-500 relative ${
                isAuction ? 'bg-[#800080]' : ''
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full absolute transition-transform duration-300 ease-in-out ${
                  isAuction ? 'transform translate-x-full bg-[#800080]' : 'bg-gray-100'
                }`}
              ></div>
            </div>
            <p className="text-gray-500 text-sm ml-2">
              {isAuction ? 'Switch to Minting' : 'Switch to Auction'}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNFT;