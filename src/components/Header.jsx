import ArtEon from '../assets/ArtEon.png'
import Profile from '../assets/profile.png'
import { connectWallet } from '../Blockchain.Services'
import { useAuthState } from 'react-firebase-hooks/auth';
import { setGlobalState, useGlobalState, truncate} from '../store'
import {getUserCollection} from '../utils/user';
import { updateCollectorWalletId, getCollectorNameByUID } from '../utils/collector';
import { updateArtistWalletId, getArtistNameByUID } from '../utils/artist';
import { auth } from '../utils/firebase';




const Header = () => {
  const [userInfo] = useAuthState(auth);
  if(userInfo){
  setGlobalState('userID', userInfo.uid);
  }
  const [connectedAccount] = useGlobalState('connectedAccount')
 


  const handlewalletId = async (e) => {
        try {
        if(userInfo){
          const userType = await getUserCollection(userInfo.uid);
          console.log(userType);
          setGlobalState('usertype', userType);
        if (userType === 'artist') {
            await updateArtistWalletId(userInfo.uid,connectedAccount);
            let artistname = await getArtistNameByUID(userInfo.uid);
            setGlobalState('userName', artistname);
        } else if (userType === 'collector') {
            await updateCollectorWalletId(userInfo.uid,connectedAccount);
            let collectorname = await getCollectorNameByUID(userInfo.uid);
            setGlobalState('userName', collectorname);
            console.log("updated")
        }
       
      }
    } catch (error) {
        console.error('update failed:', error.message);
    }
};


  return (
    <nav className="w-4/5 flex md:justify-center justify-between items-center py-4 mx-auto">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <a href='/home'>
          <img
          className="w-32 cursor-pointer"
          src={ArtEon}
          alt="Timeless Logo"
        />
        </a>
      </div>


      <ul
        className="md:flex-[0.5] text-white md:flex
        hidden list-none flex-row justify-between
        items-center flex-initial"
      >
        <a href='/market'><li className="mx-4 cursor-pointer">  Market</li></a>
        <li className="mx-4 cursor-pointer">Artist</li>
        <li className="mx-4 cursor-pointer">Features</li>
        <li className="mx-4 cursor-pointer">Community</li>
      </ul>


      {connectedAccount ? (
        <>
        <button
          className="shadow-xl shadow-black text-white
        bg-[#800080] hover:bg-[#b300b3] md:text-xs p-2
          rounded-full cursor-pointer"
        onClick={handlewalletId}>
          {truncate(connectedAccount, 4, 4, 11)}
        </button>
        <a href={`/${connectedAccount}`}>
        <img
          className="w-8 h-8 rounded-full ml-2 cursor-pointer"
          src={Profile}
           // Replace with the path to the user profile logo
          alt="User Profile"
        />
      </a>
    </>
      ) : (
        <button
          className="shadow-xl shadow-black text-white
          bg-[#800080] hover:bg-[#b300b3] md:text-xs p-2
          rounded-full cursor-pointer"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}


    </nav>
  )
}


export default Header





