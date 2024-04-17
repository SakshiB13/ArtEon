// EditProfile.jsx

import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { updateArtistProfile } from '../utils/artist';
import { auth } from '../utils/firebase';
import Footer from './Footer';
import Header from './Header';

const EditProfile = () => {
  const [userInfo] = useAuthState(auth);
  const [name, setName] = useState('');
  const [quote, setQuote] = useState('');
  const [email, setEmail] = useState('');
  const [insta, setInsta] = useState('');
  const [website, setWebsite] = useState('');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [bannerPicFile, setBannerPicFile] = useState(null);


  const handleProfilePicChange = (e) => {
    setProfilePicFile(e.target.files[0]);
  };

  const handleBannerPicChange = (e) => {
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
      const isupdated = await updateArtistProfile(userInfo.uid, name, quote, email, insta, website, profilePicFile, bannerPicFile);
      if(isupdated){
        console.log('Artist profile updated successfully!');
        window.location.href = '/home';
      }

      // Optionally, add a success message or redirect to another page upon successful update
    } catch (error) {
      console.error('Error updating artist profile:', error);
      // Handle error (e.g., display error message to user)
    }
  };

 


  return (
    <div className="min-h-screen">
      <div className="gradient-bg-hero">
        <Header />
      </div>
    <div className="container-body-signupp">
      <div className="edit-profile-container">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Profile Picture:</label>
            <input type="file" onChange={handleProfilePicChange} />
          </div>
          <div className="form-group">
            <label>Banner Picture:</label>
            <input type="file" onChange={handleBannerPicChange} />
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