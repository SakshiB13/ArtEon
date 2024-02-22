import React, { useEffect } from 'react';
import { getAllNFTs, isWalletConnected, getNFTsByAddresss} from './Blockchain.Services';
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



const Home = () => {
    useEffect(async () => {
    await isWalletConnected();
    await getAllNFTs();
    //await burnNFT(4); 

  }, []);

  return (
    <div className="min-h-screen">
            <div className="gradient-bg-hero">
              <Header />
              <Hero />
            </div>
            <Artworks />
            <Transactions />
            <CreateNFT />
            <ShowNFT />
            <UpdateNFT />
            <Footer />
            <Alert />
            <Loading />
            <ForgotPassword />
    </div>
  );
};

export default Home;
