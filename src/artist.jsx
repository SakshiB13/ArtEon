// ArtistPage.jsx

import React, { useEffect, useState } from 'react';
import { getAllNFTs, isWalletConnected } from './Blockchain.Services';
import Footer from './components/Footer';
import Header from './components/Header';
import { getAllArtists } from './utils/artist';


const ArtistPage = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const fetchedArtists = await getAllArtists(); // Fetch artists asynchronously
        setArtists(fetchedArtists); // Update state with fetched artists
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };

    fetchArtists();
  }, []);

  console.log(artists);

  return (
    <div className="min-h-screen">
      <div className="gradient-bg-hero">
        <Header />
      </div>
      <div className="container-fluid mx-auto mt-10 px-4 mb-10">
        <div className="grid grid-cols-5 gap-8">
          {artists.map((artist) => (
            <div key={artist.id} className="artist-card"> {/* Apply class name */}
              <img className="w-full h-48 object-cover object-center rounded-full" src={artist.profilePicture} alt={artist.name} />
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
