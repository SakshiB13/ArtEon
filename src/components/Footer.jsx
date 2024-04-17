import ArtEonLogo from '../assets/ArtEon.png';
import { useTheme } from './themeContext'; // Import the useTheme hook

const Footer = () => {
  const { darkMode } = useTheme(); // Get darkMode state from the theme context

  return (
    <div className={`w-full flex md:justify-center justify-between items-center flex-col p-4 ${darkMode ? 'bg-[#F8F0E3]' : 'gradient-bg-footer'}`}>
      <div className="w-full flex sm:flex-row flex-col justify-between items-center my-4">
        <div className="flex flex-[0.25] justify-center items-center">
          <img src={ArtEonLogo} alt="logo" className="w-32" />
        </div>

        <div className="flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-5 w-full">
          <p className={`text-${darkMode ? 'gray-900' : 'white'} text-base text-center mx-2 cursor-pointer`}>
            <a href='/market'> Market </a>
          </p>
          <p className={`text-${darkMode ? 'gray-900' : 'white'} text-base text-center mx-2 cursor-pointer`}>
            <a href='/artist'> Artist</a>
          </p>
          <p className={`text-${darkMode ? 'gray-900' : 'white'} text-base text-center mx-2 cursor-pointer`}>
            <a href='/collector'> Collector</a>
          </p>
          <p className={`text-${darkMode ? 'gray-900' : 'white'} text-base text-center mx-2 cursor-pointer`}>
            <a href='/feature'> Features</a>
          </p>
        </div>

        <div className="flex flex-[0.25] justify-center items-center">
          <p className={`text-${darkMode ? 'gray-900' : 'white'} text-right text-xs`}>
            &copy;2024 All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
