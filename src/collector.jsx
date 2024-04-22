import React, { useEffect, useState } from 'react';
import { getAllCollectors } from './utils/collector'; // Assuming a function to fetch collectors
import Footer from './components/Footer';
import Header from './components/Header';
import { useTheme } from './components/themeContext'; // Import the useTheme hook

const CollectorPage = () => {
  const [collectors, setCollectors] = useState([]);
  const { darkMode } = useTheme(); // Get darkMode state from the theme context

  useEffect(() => {
    const fetchCollectors = async () => {
      try {
        const fetchedCollectors = await getAllCollectors(); // Assuming getAllCollectors fetches collector data
        setCollectors(fetchedCollectors);
      } catch (error) {
        console.error('Error fetching collectors:', error);
      }
    };

    fetchCollectors();
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-white' : ''}`}>
      <div className={`gradient-bg-hero ${darkMode ? 'bg-white' : ''}`}>
        <Header />
      </div>
      <div className={`container-fluid mx-auto container-body-signupp px-5 ${darkMode ? 'bg-white' : ''}`}>
        <div className="grid grid-cols-5 gap-8">
          {collectors.map((collector) => (
            <div key={collector.id} className="artist-card">
              <div className="artist-image-container">
                <img className="artist-image" src={collector.profilePicture} alt={collector.name} />
              </div>
              <div className="artist-details">
                <h2 className="artist-name">{collector.name}</h2>
                <p className="artist-quote">{collector.quote}</p>
                <a href={`/${collector.walletId}`}><button className="view-profile-btn">View Profile</button></a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CollectorPage;
