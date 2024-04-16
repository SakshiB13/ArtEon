import React, { useEffect } from 'react';
import { getAllNFTs, isWalletConnected  } from './Blockchain.Services';
import Footer from './components/Footer';
import Header from './components/Header';


const CollectorPage = () => {

  return (
    <div className="min-h-screen">
            <div className="gradient-bg-hero">
              <Header />
            </div>
           
            <Footer />
          
    </div>
  );
};

export default CollectorPage;
