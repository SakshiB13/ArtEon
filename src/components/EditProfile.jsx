// EditProfile.jsx
import React, { useState } from 'react';
import { useGlobalState, setGlobalState } from '../store';
import { FaTimes } from 'react-icons/fa';

const EditProfile = () => {
  const [EditProfilemodal] = useGlobalState('EditProfilemodal');
  const [name, setName] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [socialLinks, setSocialLinks] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform form submission logic here
    console.log('Submitted:', { name, bannerImage, profilePic, socialLinks });

    // Reset form fields after submission
    setName('');
    setBannerImage('');
    setProfilePic('');
    setSocialLinks('');

    // Close modal after submission
    setGlobalState('EditProfilemodal', 'scale-0');
  };

  const closeModal = () => {
    // Close modal without performing any action
    setGlobalState('EditProfilemodal', 'scale-0');
  };

  return (
    <div className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 transform transition-transform duration-300 ${EditProfilemodal}`}>
      <div className="bg-[#151c25] shadow-xl shadow-[#e32970] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold text-gray-400">Edit Profile</p>
            <button type="button" onClick={closeModal} className="border-0 bg-transparent focus:outline-none">
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          <input
            className="block w-full text-sm text-slate-500 bg-transparent border-0 focus:outline-none focus:ring-0"
            type="text"
            name="name"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />

          {/* Add more input fields for banner image, profile picture, and social links */}

          <button
            type="submit"
            className="flex flex-row justify-center items-center w-full text-white text-md bg-[#800080] hover:bg-[#b300b3] py-2 px-5 rounded-full drop-shadow-xl border border-transparent hover:bg-transparent hover:text-[#800080] hover:border hover:border-[#b300b3] focus:outline-none focus:ring mt-5"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
