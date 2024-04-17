import React, { useEffect } from 'react';
import { getAllNFTs, isWalletConnected, getAllAuctions } from './Blockchain.Services';
import Alert from './components/Alert';
import Artworks from './components/Artworks';
import CreateNFT from './components/CreateNFT';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import Loading from './components/Loading';
import ShowNFT from './components/ShowNFT';
import Transactions from './components/Transactions';
import UpdateNFT from './components/UpdateNFT';
import ForgotPassword from './ForgotPassword';
import StartAuction from './components/StartAuction';
import { useTheme } from './components/themeContext'; // Import the useTheme hook

const Home = () => {
  const { darkMode } = useTheme(); // Get darkMode state from the theme context

  useEffect(() => {
    const fetchData = async () => {
      await isWalletConnected();
      await getAllNFTs();
      await getAllAuctions();
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      <div className={`gradient-bg-hero ${darkMode ? 'bg-white' : ''}`}>
        <Header />
        <Hero />
      </div>
      <Artworks />
      <Transactions />
      <CreateNFT />
      <ShowNFT />
      <UpdateNFT />
      <StartAuction />
      <Footer />
      <Alert />
      <Loading />
    </div>
  );
};

export default Home;
