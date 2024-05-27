import React, { useEffect } from 'react';
import { getAllNFTs, isWalletConnected  } from './Blockchain.Services';
import Alert from './components/Alert';
import Artworks from './components/Artworks';
import CreateNFT from './components/CreateNFT';
import Footer from './components/Footer';
import Header from './components/Header';
import Loading from './components/Loading';
import ShowNFT from './components/ShowNFT';
import UpdateNFT from './components/UpdateNFT';
import EditProfile from './components/EditProfile';
import StartAuction from './components/StartAuction';
import { useTheme } from './components/themeContext'; // Import the useTheme hook


const Displaymarket = () => {
    useEffect(async () => {
    await isWalletConnected();
    await getAllNFTs();
    //await burnNFT(1);

  }, []);
  const { darkMode } = useTheme(); // Get darkMode state from the theme context

  return (
    <div className="min-h-screen">
            <div className={`gradient-bg-hero ${darkMode ? 'bg-white' : ''}`}>
        <Header />
      </div>
            <Artworks />
            <CreateNFT />
            <ShowNFT />
            <UpdateNFT />
            <Footer />
            <Alert />
            <Loading />
            <StartAuction/>
    </div>
  );
};

export default Displaymarket;
