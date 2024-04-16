// ArtistPage.jsx

import React, { useEffect, useState } from 'react';
import { getAllNFTs, isWalletConnected } from './Blockchain.Services';
import Footer from './components/Footer';
import Header from './components/Header';

const dummyArtists = [
  { id: 1, name: 'Artist 1', profilePic: 'profile1.jpg', quote: 'Quote 1' },
  { id: 2, name: 'Artist 2', profilePic: 'profile2.jpg', quote: 'Quote 2' },
  { id: 3, name: 'Artist 3', profilePic: 'profile3.jpg', quote: 'Quote 3' },
  { id: 4, name: 'Artist 4', profilePic: 'profile4.jpg', quote: 'Quote 4' },
  { id: 5, name: 'Artist 5', profilePic: 'profile5.jpg', quote: 'Quote 5' },
  { id: 6, name: 'Artist 3', profilePic: 'profile3.jpg', quote: 'Quote 3' },
  { id: 7, name: 'Artist 4', profilePic: 'profile4.jpg', quote: 'Quote 4' },
  { id: 8, name: 'Artist 5', profilePic: 'profile5.jpg', quote: 'Quote 5' },
];

const ArtistPage = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    setArtists(dummyArtists);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="gradient-bg-hero">
        <Header />
      </div>
      <div className="container-fluid mx-auto mt-10 px-4 mb-10">
        <div className="grid grid-cols-5 gap-8">
          {artists.map((artist) => (
            <div key={artist.id} className="artist-card"> {/* Apply class name */}
              <img className="w-full h-48 object-cover object-center rounded-full" src={artist.profilePic} alt={artist.name} />
              <div className="artist-details"> {/* Apply class name */}
                <h2 className="artist-name">{artist.name}</h2>
                <p className="artist-quote">{artist.quote}</p>
                <button className="view-profile-btn">View Profile</button> {/* Apply class name */}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ArtistPage;
