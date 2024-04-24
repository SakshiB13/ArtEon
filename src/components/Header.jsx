import React, { useRef, useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { connectWallet } from '../Blockchain.Services';
import { useGlobalState, setGlobalState, truncate } from '../store';
import { getUserCollection } from '../utils/user';
import { updateCollectorWalletId, getCollectorNameByUID } from '../utils/collector';
import { updateArtistWalletId, getArtistNameByUID } from '../utils/artist';
import { auth } from '../utils/firebase';
import ArtEon from '../assets/ArtEon.png';
import Profile from '../assets/profile.png';
import EditProfile from './EditProfile';
import { useTheme } from './themeContext';

const Header = () => {
  const [userInfo] = useAuthState(auth);
  const [connectedAccount] = useGlobalState('connectedAccount');
  const usertype = useGlobalState('usertype');
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const sidePanelRef = useRef(null);
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    // Function to handle wallet connection and wallet ID update
    const handleWalletConnection = async () => {
      try {
        if (userInfo) {
          const userType = await getUserCollection(userInfo.uid);
          setGlobalState('usertype', userType);
          console.log(userType);
          if (userType === 'artist') {
            await updateArtistWalletId(userInfo.uid, connectedAccount);
            let artistname = await getArtistNameByUID(userInfo.uid);
            setGlobalState('userName', artistname);
            console.log(artistname);
          } else if (userType === 'collector') {
            await updateCollectorWalletId(userInfo.uid, connectedAccount);
            let collectorname = await getCollectorNameByUID(userInfo.uid);
            setGlobalState('userName', collectorname);
          }
        }
        // After updating wallet ID and user type, connect the wallet
        await connectWallet();
      } catch (error) {
        console.error('Wallet connection failed:', error.message);
      }
    };

    handleWalletConnection();

    // Automatically connect the wallet when the Header component mounts or userInfo changes
    if (connectedAccount) {
      // Wallet is already connected, handle wallet ID update
      handleWalletConnection();
    }
  }, [connectedAccount, userInfo]); // Trigger useEffect on connectedAccount or userInfo change

  const handleClickOutside = (event) => {
    if (sidePanelRef.current && !sidePanelRef.current.contains(event.target)) {
      setIsSidePanelOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleToggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    handleToggleSidePanel();
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <nav className={`w-4/5 flex md:justify-center justify-between items-center py-4 mx-auto `}>
        <div className="md:flex-[0.5] flex-initial justify-center items-center">
          <a href='/home'>
            <img
              className="w-32 cursor-pointer"
              src={ArtEon}
              alt="Timeless Logo"
            />
          </a>
        </div>

        <ul className={`md:flex-[0.5] text-white md:flex hidden list-none flex-row justify-between items-center flex-initial ${darkMode ? 'text-black' : ''}`}>
          <a href='/market'><li className="mx-4 cursor-pointer">Market</li></a>
          <a href='/artistpage'><li className="mx-4 cursor-pointer">Artist</li></a>
          <a href='/collectorpage'><li className="mx-4 cursor-pointer">Collector</li></a>
          <a href='/auction'><li className="mx-4 cursor-pointer">Auction</li></a>
        </ul>

        {connectedAccount ? (
          <>
            <button
              className="shadow-xl shadow-black text-white bg-[#800080] hover:bg-[#b300b3] md:text-xs p-2 rounded-full cursor-pointer"
              //onClick={handlewalletId}
            >
              {truncate(connectedAccount, 4, 4, 11)}
            </button>
            <img
              className="w-8 h-8 rounded-full ml-2 cursor-pointer"
              src={Profile}
              alt="User Profile"
              onClick={handleProfileClick}
            />
          </>
        ) : (
          <button
            className="shadow-xl shadow-black text-white  dark:bg-[#800080] hover:bg-[#b300b3] md:text-xs p-2 rounded-full cursor-pointer"
            //onClick={handleWalletConnection} // Connect wallet when button is clicked
          >
            Connect Wallet
          </button>
        )}

        {isSidePanelOpen && (
          <div ref={sidePanelRef} className={`side-panel ${isSidePanelOpen ? 'open' : ''}`}>
            <ul>
              <li><a href='/editprofile'>Edit Profile</a></li>
              <li><a href={`/${connectedAccount}`}>Visit Profile</a></li>
              <li className="" onClick={toggleDarkMode}>{darkMode ? "Dark Mode" : "Light Mode"}</li>
              <li>Logout</li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Header;
