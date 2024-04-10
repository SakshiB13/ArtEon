import React, { useState, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { connectWallet } from '../Blockchain.Services';
import { useGlobalState, setGlobalState, truncate } from '../store';
import { getUserCollection } from '../utils/user';
import { updateCollectorWalletId, getCollectorNameByUID } from '../utils/collector';
import { updateArtistWalletId, getArtistNameByUID } from '../utils/artist';
import { auth } from '../utils/firebase';
import ArtEon from '../assets/ArtEon.png';
import Profile from '../assets/profile.png';

const Header = () => {
  const [userInfo] = useAuthState(auth);
  const [connectedAccount] = useGlobalState('connectedAccount');
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const sidePanelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidePanelRef.current && !sidePanelRef.current.contains(event.target)) {
        setIsSidePanelOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleToggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  const handlewalletId = async (e) => {
    try {
      if (userInfo) {
        const userType = await getUserCollection(userInfo.uid);
        console.log(userType);
        setGlobalState('usertype', userType);
        if (userType === 'artist') {
          await updateArtistWalletId(userInfo.uid, connectedAccount);
          let artistname = await getArtistNameByUID(userInfo.uid);
          setGlobalState('userName', artistname);
        } else if (userType === 'collector') {
          await updateCollectorWalletId(userInfo.uid, connectedAccount);
          let collectorname = await getCollectorNameByUID(userInfo.uid);
          setGlobalState('userName', collectorname);
          console.log("updated")
        }
      }
    } catch (error) {
      console.error('update failed:', error.message);
    }
  };

  const handleProfileClick = (e) => {
    e.stopPropagation(); // Stop event propagation to prevent closing the panel immediately
    handleToggleSidePanel(); // Open or close the side panel
  };

  return (
    <nav className="w-4/5 flex md:justify-center justify-between items-center py-4 mx-auto">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <a href='/home'>
          <img
            className="w-32 cursor-pointer"
            src={ArtEon}
            alt="Timeless Logo"
          />
        </a>
      </div>

      <ul
        className="md:flex-[0.5] text-white md:flex hidden list-none flex-row justify-between items-center flex-initial"
      >
        <a href='/market'><li className="mx-4 cursor-pointer">Market</li></a>
        <li className="mx-4 cursor-pointer">Artist</li>
        <li className="mx-4 cursor-pointer">Features</li>
        <li className="mx-4 cursor-pointer">Community</li>
      </ul>

      {connectedAccount ? (
        <>
          <button
            className="shadow-xl shadow-black text-white bg-[#800080] hover:bg-[#b300b3] md:text-xs p-2 rounded-full cursor-pointer"
            onClick={handlewalletId}
          >
            {truncate(connectedAccount, 4, 4, 11)}
          </button>
          <img
            className="w-8 h-8 rounded-full ml-2 cursor-pointer"
            src={Profile}
            alt="User Profile"
            onClick={handleProfileClick} // Attach handleProfileClick function
          />
        </>
      ) : (
        <button
          className="shadow-xl shadow-black text-white bg-[#800080] hover:bg-[#b300b3] md:text-xs p-2 rounded-full cursor-pointer"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}

      {isSidePanelOpen && (
        <div ref={sidePanelRef} className={`side-panel ${isSidePanelOpen ? 'open' : ''}`}>
          <ul>
            <li>Edit Profile</li>
            <li><a href={`/${connectedAccount}`}>Visit Profile</a></li>
            <li>Switch Mode</li>
            <li>Logout</li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Header;
