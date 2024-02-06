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


const Displaymarket = () => {
    useEffect(async () => {
    await isWalletConnected();
    await getAllNFTs();
    //await burnNFT(1);

  }, []);

  return (
    <div className="min-h-screen">
            <div className="gradient-bg-hero">
              <Header />
            </div>
            <Artworks />
            <CreateNFT />
            <ShowNFT />
            <UpdateNFT />
            <Footer />
            <Alert />
            <Loading />
    </div>
  );
};

export default Displaymarket;
