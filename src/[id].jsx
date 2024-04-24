import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAllNFTs, getNFTsByAddress } from './Blockchain.Services';
import { useGlobalState, setGlobalState } from './store';
import { getUserCollectionbywalletId } from './utils/user';
import { getArtistByWalletId } from './utils/artist';
import { getCollectorByWalletId } from './utils/collector';
import { useTheme } from './components/themeContext'; // Import the useTheme hook
import mail from './assets/mail.png';
import instagram from './assets/instagram.png';

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
  const [usertype] = useGlobalState('usertype');

  useEffect(async () => {
    await getNFTsByAddress(addr);
    const fetchData = async () => {
      try {
      const usertype = await getUserCollectionbywalletId(addr.id);
      //console.log(usertype);
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
        <div className={Style.midRow}>
          <div className={Style.description}>{collection?.quote}</div>
        </div>
      </div>
      <div className="w-4/5 py-10 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-3 py-2.5">
          {nfts.map((nft, i) => (
            <Card key={i} nft={nft} darkMode={darkMode} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Card = ({ nft, darkMode }) => {

  
  const setNFT = () => {
    setGlobalState('nft', nft)
    setGlobalState('showModal', 'scale-100')
  }

  return (
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

export default Portfolio;