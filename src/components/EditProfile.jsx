import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import Header from './Header';
import { useTheme } from './themeContext';
import { useGlobalState, setGlobalState, truncate } from '../store';
import { getUserCollection } from '../utils/user';
import { updateArtistProfile } from '../utils/artist';
import { updateCollectorProfile } from '../utils/collector';
import { auth } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const EditProfile = () => {
  const [user] = useAuthState(auth); // Fetch the authenticated user
  const [connectedAccount] = useGlobalState('connectedAccount');
  const [name, setName] = useState('');
  const [quote, setQuote] = useState('');
  const [email, setEmail] = useState('');
  const [insta, setInsta] = useState('');
  const [website, setWebsite] = useState('');
  const { darkMode } = useTheme(); // Get darkMode state from the theme context

  const [profilePicFile, setProfilePicFile] = useState(null);
  const [bannerPicFile, setBannerPicFile] = useState(null);

  useEffect(() => {
    if (user) {
      setEmail(user.email); // Set the email input field to the user's email
    }
  }, [user]);

  const handleProfilePicChangeFile = (e) => {
    setProfilePicFile(e.target.files[0]);
  };

  const handleBannerPicChangeFile = (e) => {
    setBannerPicFile(e.target.files[0]);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const usertype = await getUserCollection(user.uid);
      console.log(usertype);
      if (usertype === 'artist') {
        await updateArtistProfile(user.uid, name, quote, email, insta, website, profilePicFile, bannerPicFile);
        console.log('Artist profile updated successfully!');
        window.location.href = '/' + connectedAccount;
      } else if (usertype === 'collector') {
        await updateCollectorProfile(user.uid, name, quote, email, insta, website, profilePicFile, bannerPicFile);
        console.log('Collector profile updated successfully!');
        window.location.href = '/' + connectedAccount;
      }
      // Optionally, add a success message or redirect to another page upon successful update
    } catch (error) {
      console.error('Error updating profile:', error);
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
              <input type="file" onChange={handleProfilePicChangeFile} />
            </div>
            <div className="form-group">
              <label>Banner Picture:</label>
              <input type="file" onChange={handleBannerPicChangeFile} />
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
              <input type="email" value={email} onChange={handleEmailChange} disabled className={email ? '' : 'disabled-cursor'} />
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
