import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAllNFTs, getNFTsByAddress, buyNFT, listForSale } from './Blockchain.Services';
import { useGlobalState, setGlobalState } from './store';
import { getUserCollectionbywalletId } from './utils/user';
import { getArtistByWalletId } from './utils/artist';
import { getCollectorByWalletId } from './utils/collector';
import { useTheme } from './components/themeContext'; // Import the useTheme hook
import mail from './assets/mail.png';
import instagram from './assets/instagram.png';
import Identicon from 'react-identicons';
import { FaTimes } from 'react-icons/fa';
import Web3 from 'web3'
import { truncate, setAlert} from './store';

const Style = {
  bannerImageContainer: 'h-[35vh] w-screen overflow-hidden flex justify-center items-center',
  portfolioTitle: 'text-4xl font-bold italic text-center mt-2 mb-2 font-dancing-script text-white', // Updated with the font-dancing-script class
  bannerImage: 'w-full object-cover',
  infoContainer: 'w-screen px-4',
  midRow: 'w-full flex justify-center',
  endRow: 'w-full flex justify-end',
  profileImg: 'w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-4rem]',
  socialIconsContainer: 'flex text-3xl mb-[-2rem]',
  socialIconsWrapper: 'w-44',
  socialIconsContent: 'flex container justify-between text-[1.4rem] border-2 rounded-lg px-2',
  socialIcon: 'my-2',
  divider: 'border-r-2',
  title: 'text-5xl font-bold mb-4',
  createdBy: 'text-lg mb-4 text-white',
  statsContainer: 'w-[44vw] flex justify-between py-4 border border-[#151b22] rounded-xl mb-4',
  collectionStat: 'w-1/4 text-white',
  statValue: 'text-2xl font-bold w-full flex items-center justify-center text-white',
  ethLogo: 'h-6 mr-2',
  statName: 'text-lg w-full text-center mt-1 ',
  description: 'text-[#8a939b] text-xl w-max-1/4 flex-wrap mt-4 text-white',
};

const Portfolio = () => {
  const { id } = useParams();
  const addr = { id };
  const { darkMode } = useTheme(); // Get darkMode state from the theme context
  const [userType] = useGlobalState('usertype');
  const [isModalvisible, setModalVisible] = useState(false);
 //console.log(userype);
 
 const [connectedAccount, setAccount] = useState('');
 //console.log(connectedAccount);
  useEffect(async () => {
    await getNFTsByAddress(addr);
    const fetchData = async () => {
      try {
      
      const usertype = await getUserCollectionbywalletId(addr.id);
      //setGlobalState(usertype, 'usertype');
      //console.log(userType);
        if (usertype === 'artist') {
          const fetchedArtists = await getArtistByWalletId(addr.id);
          setCollection(fetchedArtists);
        } else if (usertype === 'collector') {
          const fetchedCollectors = await getCollectorByWalletId(addr.id);
          setCollection(fetchedCollectors);
        }
      
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [addr]); // Add addr as a dependency

  const [collection, setCollection] = useState({});
  const [nfts] = useGlobalState('nftsByAddress');
  //console.log(nfts)

  return (
    <div className={`overflow-hidden ${darkMode ? 'bg-white' : 'bg-white'}`}>
      <div className={`gradient-bg-hero ${darkMode ? 'bg-white' : ''}`}>
        <div className="w-4/5 mx-auto py-4 flex justify-center items-center">
          <a href="/home">
            <img
              className="w-32 cursor-pointer"
              src="\images\ArtEon copy.png"
              alt="ArtEon Logo"
            />
          </a>
          <h1 className={`${Style.portfolioTitle}`}>Portfolio</h1>
        </div>
      </div>
      <div className={`gradient-bg-hero ${darkMode ? 'bg-white' : ''}`}>
      <div className={Style.bannerImageContainer}>
        <img
          className={Style.bannerImage}
          src={collection?.bannerPicture ? collection.bannerPicture : 'https://via.placeholder.com/150'}
          alt="banner"
        />
      </div>
      <div className={Style.infoContainer}>
        <div className={Style.midRow}>
          <img
            className={Style.profileImg}
            src={collection?.profilePicture ? collection.profilePicture : 'https://via.placeholder.com/150'}
            alt="profile image"
          />
        </div>
        <div className={Style.endRow}>
          <div className={Style.socialIconsContainer}>
            <div className={Style.socialIconsWrapper}>
            </div>
          </div>
        </div>
        <div className={Style.midRow}>
          <div className={`${Style.title}`}>{collection?.title}</div>
        </div>
        <div className={Style.midRow}>
          <div className={`${Style.createdBy} ${darkMode ? 'text-black' : ''}`}>
            Created by <span className="text-[#2081e2]">{collection?.name}</span>
          </div>
        </div>
        <div className={Style.midRow}>
          <div className={Style.statsContainer}>
            <div className={Style.collectionStat}>
              <div className={`${Style.statValue} ${darkMode ? 'text-black' : 'text-white'}`}>{nfts.length}</div>
              <div className={`${Style.statName} ${darkMode ? 'text-black' : 'text-white'}`}>items</div>
            </div>
            <div className={Style.collectionStat}>
              <div className={Style.statValue}>
                <a href={`mailto: ${collection?.email}`}><img
                  src={mail}
                  alt="eth"
                  className={Style.ethLogo}
                />
                </a>
              </div>
              <div className={`${Style.statName} ${darkMode ? 'text-black' : 'text-white'}`}>email</div>
            </div>
            <div className={Style.collectionStat}>
              <div className={Style.statValue}>
                <a href={`https://www.instagram.com/${collection?.insta}`}><img
                  src={instagram}
                  alt="eth"
                  className={Style.ethLogo}
                />
                </a>
                {collection?.floorPrice}
              </div>
              <div className={` ${Style.statName} ${darkMode ? 'text-black' : 'text-white'}`}>Instagram</div>
            </div>
          </div>
        </div>
        </div>
        <div className={Style.midRow}>
          <div className={Style.description}>{collection?.quote}</div>
        </div>
      </div>
      <div className="w-4/5 py-10 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-3 py-2.5">
        {nfts.map((nft, i) => (
              <Card key={i} nft={nft} darkMode={darkMode} setModalVisible={setModalVisible} />
          ))}

        </div>
      </div>
      { isModalvisible === true ? <ShowNFT account= {connectedAccount}/> : <></> }
    </div>
  );
};

const Card = ({ nft, darkMode, setModalVisible}) => {


  const setNFT = () => {
    setGlobalState('nft', nft)
    setGlobalState('showModal', 'scale-100')
    setModalVisible(true);

  }
  return(
   
     <div className={` w-full shadow-xl shadow-black rounded-md overflow-hidden my-2 p-3 ${darkMode ? ' bg-[#800080]' : 'bg-gray-800'}`}>
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
          className="shadow-lg shadow-black text-white text-sm bg-[#e32970] hover:bg-[#bd255f] cursor-pointer rounded-full px-1.5 py-1"
          onClick={setNFT}
        >
          View Details
        </button>
      </div>
    </div>
  )
  
}

const ShowNFT =  ({account}) => {
  const [showModal] = useGlobalState('showModal')
  const [nft] = useGlobalState('nft');
  //console.log(nft);
  const [auctions] = useGlobalState('auctions');
  const connectedAccount= account;
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
    setGlobalState('startAuctionModal', 'scale-100');
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
      msg: 'Initializing NFT transfer...',
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
            {connectedAccount === nft?.owner ? (
              auctionItem?.active && currentTime < endTime ? (
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
              ) : nft?.listedforSale === false  ? (

                <button
                className="flex flex-row justify-center items-center
                  w-full text-white text-md bg-[#e32970]
                  hover:bg-[#bd255f] py-2 px-5 rounded-full
                  drop-shadow-xl border border-transparent
                  hover:bg-transparent hover:text-[#e32970]
                  hover:border hover:border-[#bd255f]
                  focus:outline-none focus:ring mt-5"
                onClick={handleListForSale}
              >
                 List for Sale
              </button>
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
            )}
            {/* { connectedAccount === nft?.owner && nft?.listedforSale === false(
              <button
              className="flex flex-row justify-center items-center
                w-full text-white text-md bg-[#e32970]
                hover:bg-[#bd255f] py-2 px-5 rounded-full
                drop-shadow-xl border border-transparent
                hover:bg-transparent hover:text-[#e32970]
                hover:border hover:border-[#bd255f]
                focus:outline-none focus:ring mt-5"
              onClick={handleListForSale}
            >
               List for Sale
            </button>
          )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
