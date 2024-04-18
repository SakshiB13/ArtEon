import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { updateArtistProfile } from '../utils/artist';
import { useGlobalState, setGlobalState, truncate } from '../store';
import { auth } from '../utils/firebase';
import Footer from './Footer';
import Header from './Header';
import { useTheme } from './themeContext'; // Import the useTheme hook

const EditProfile = () => {
  const [userInfo] = useAuthState(auth);
  const [name, setName] = useState('');
  const [quote, setQuote] = useState('');
  const [email, setEmail] = useState('');
  const [insta, setInsta] = useState('');
  const [website, setWebsite] = useState('');
  const { darkMode } = useTheme(); // Get darkMode state from the theme context
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [bannerPicFile, setBannerPicFile] = useState(null);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleQuoteChange = (e) => {
    setQuote(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleInstaChange = (e) => {
    setInsta(e.target.value);
  };

  const handleWebsiteChange = (e) => {
    setWebsite(e.target.value);
  };
  // const handleProfilePicChange = (e) => {
  //   setProfilePicFile(e.target.files[0]);
  // };

  // const handleBannerPicChange = (e) => {
  //   setBannerPicFile(e.target.files[0]);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateArtistProfile(userInfo.id, name, quote, email, insta, website, profilePicFile, bannerPicFile);
      console.log('Artist profile updated successfully!');
      // Optionally, add a success message or redirect to another page upon successful update
    } catch (error) {
      console.error('Error updating artist profile:', error);
      // Handle error (e.g., display error message to user)
    }
  };

  return (
    <div className="min-h-screen">
      <div className={`gradient-bg-hero ${darkMode ? 'bg-white' : ''}`}>
        <Header />
      </div>
    <div className={`container-body-signupp ${darkMode ? 'bg-[#F8F0E3]' : ''}`}>
      <div className="edit-profile-container">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Profile Picture:</label>
            <input type="file"  onChange={handleProfilePicChange} />
          </div>
          <div className="form-group">
            <label>Banner Picture:</label>
            <input type="file"  onChange={handleBannerPicChange} />
          </div>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" value={name} onChange={handleNameChange} />
          </div>
          <div className="form-group">
            <label>Quote:</label>
            <input type="text" value={quote} onChange={handleQuoteChange} />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="emaill" value={email} onChange={handleEmailChange} />
          </div>
          <div className="form-group">
            <label>Instagram:</label>
            <input type="text" value={insta} onChange={handleInstaChange} />
          </div>
          <div className="form-group">
            <label>Website:</label>
            <input type="text" value={website} onChange={handleWebsiteChange} />
          </div>
          <div className="button-container">
          <button type="submit">Save Changes</button>
          </div>
        </form>
      </div>
      </div>
      <Footer />
    
    </div>
  );
};

export default EditProfile;