import React, { useEffect, useState } from 'react';
import { getAllArtists } from './utils/artist';
import Footer from './components/Footer';
import Header from './components/Header';
import { useTheme } from './components/themeContext'; // Import the useTheme hook

const ArtistPage = () => {
  const [artists, setArtists] = useState([]);
  const { darkMode } = useTheme(); // Get darkMode state from the theme context

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const fetchedArtists = await getAllArtists();
        setArtists(fetchedArtists);
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };

    fetchArtists();
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-white' : ''}`}> {/* Conditionally apply white background */}
      <div className={`gradient-bg-hero ${darkMode ? 'bg-white' : ''}`}>
        <Header />
      </div>
      <div className={`container-fluid mx-auto container-body-signupp px-5 ${darkMode ? 'bg-white' : ''}`}>
        <div className="grid grid-cols-5 gap-8">
          {artists.map((artist) => (
            <div key={artist.id} className="artist-card">
            <div className="artist-image-container">
              <img className="artist-image" src={artist.profilePicture} alt={artist.name} />
            </div>
            <div className="artist-details">
              <h2 className="artist-name">{artist.name}</h2>
              <p className="artist-quote">{artist.quote}</p>
              <button className="view-profile-btn">View Profile</button>
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
