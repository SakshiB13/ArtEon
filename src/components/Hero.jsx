import Identicon from 'react-identicons';
import { setGlobalState, useGlobalState, truncate } from '../store';
import { useTheme } from './themeContext'; // Import the useTheme hook

const Hero = () => {
  const [connectedAccount] = useGlobalState('connectedAccount');
  const [userName] = useGlobalState('userName');
  const [usertype] = useGlobalState('usertype');
  const { darkMode } = useTheme(); // Get darkMode state from the theme context

  const onCreatedNFT = () => {
    setGlobalState('modal', 'scale-100');
  };

  return (
    <div className="flex flex-col md:flex-row w-4/5 justify-between items-center mx-auto py-10">
      <div className="md:w-3/6 w-full">
        <div>
          
          <h1 className="text-white text-5xl font-bold">
            Buy and Sell <br /> Digital Arts, <br />
            <span className="text-gradient">NFTs</span> Collections
          </h1>
          <p className="text-gray-500 font-semibold text-sm mt-3">
            Mint and collect the Digital Art NFTs around.
          </p>
        </div>

        <div className="flex flex-row mt-5">
          {usertype === 'artist' && ( 
            <button
              className="shadow-xl shadow-black text-white bg-[#800080] hover:bg-[#b300b3] rounded-full cursor-pointer p-2"
              onClick={onCreatedNFT}
            >
              Create NFT
            </button>
          )}
        </div>

        <div className="w-3/4 flex justify-between items-center mt-5">
          <div>
            <p className={`text-white font-bold ${darkMode ? 'text-gray-500' : ''}`}>1231k</p>
            <small className={`text-gray-300 ${darkMode ? 'text-gray-700' : ''}`}>User</small>
          </div>
          <div>
            <p className={`text-white font-bold ${darkMode ? 'text-gray-500' : ''}`}>152k</p>
            <small className={`text-gray-300 ${darkMode ? 'text-gray-700' : ''}`}>Artwork</small>
          </div>
          <div>
            <p className={`text-white font-bold ${darkMode ? 'text-gray-500' : ''}`}>200k</p>
            <small className={`text-gray-300 ${darkMode ? 'text-gray-700' : ''}`}>Artist</small>
          </div>
        </div>
      </div>

      <div className="shadow-xl shadow-black md:w-2/5 w-full mt-10 md:mt-0 rounded-md overflow-hidden bg-gray-800">
        <video
          loop // Set loop to repeat the video
          muted
          className="h-60 w-full object-cover"
        >
          <source src="\images\Vmake-1712400512196.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="flex justify-start items-center p-3">
          <Identicon
            string={connectedAccount ? connectedAccount : 'Connect Your Wallet'}
            size={50}
            className="h-10 w-10 object-contain rounded-full mr-3"
          />
          <div>
            <p className="text-white font-semibold">
              {connectedAccount
                ? truncate(connectedAccount, 4, 4, 11)
                : 'Connect Your Wallet'}
            </p>
            <small className="text-pink-800 font-bold">@{userName}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
