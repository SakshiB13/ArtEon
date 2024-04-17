import React, { useEffect } from 'react';
import { getAllNFTs, isWalletConnected  } from './Blockchain.Services';
import Footer from './components/Footer';
import Header from './components/Header';
import { useTheme } from './components/themeContext'; // Import the useTheme hook


const CollectorPage = () => {
  const { darkMode } = useTheme(); // Get darkMode state from the theme context

  return (
    <div className="min-h-screen">
            <div className={`gradient-bg-hero ${darkMode ? 'bg-white' : ''}`}>
        <Header />
      </div>
           
            <Footer />
          
    </div>
  );
};

export default CollectorPage;
