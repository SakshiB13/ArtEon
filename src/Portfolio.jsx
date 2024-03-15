import React, { useEffect , useState} from 'react';
import { getAllNFTs} from './Blockchain.Services';
/* import { useWeb3 } from './web3'; // Assuming there is a web3 module */
import { useGlobalState } from './store';
/* import { CgWebsite, AiOutlineInstagram, AiOutlineTwitter, HiDotsVertical } from 'react-icons/all'; // Import necessary icons */
import Header from './components/Header';

const Style = {
  bannerImageContainer: 'h-[20vh] w-screen overflow-hidden flex justify-center items-center',
  bannerImage: 'w-full object-cover',
  infoContainer: 'w-screen px-4',
  midRow: 'w-full flex justify-center text-white',
  endRow: 'w-full flex justify-end text-white',
  profileImg: 'w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-4rem]',
  socialIconsContainer: 'flex text-3xl mb-[-2rem]',
  socialIconsWrapper: 'w-44',
  socialIconsContent: 'flex container justify-between text-[1.4rem] border-2 rounded-lg px-2',
  socialIcon: 'my-2',
  divider: 'border-r-2',
  title: 'text-5xl font-bold mb-4',
  createdBy: 'text-lg mb-4',
  statsContainer: 'w-[44vw] flex justify-between py-4 border border-[#151b22] rounded-xl mb-4',
  collectionStat: 'w-1/4',
  statValue: 'text-3xl font-bold w-full flex items-center justify-center',
  ethLogo: 'h-6 mr-2',
  statName: 'text-lg w-full text-center mt-1',
  description: 'text-[#8a939b] text-xl w-max-1/4 flex-wrap mt-4',
};


const Portfolio = () => {
    useEffect(async () => {
        await getAllNFTs();
        //await burnNFT(4); 
    
      }, []);
  /* const router = useRouter(); */
  /* const { provider } = useWeb3(); */
/*   const { collectionId } = router.query; */
  const [collection, setCollection] = useState({});
  /* const [listings, setListings] = useState([]); */
  const [nfts] = useGlobalState('nfts');
  console.log(nfts);
  

  return (
    <div className="overflow-hidden">
      <Header />
      <div className={Style.bannerImageContainer}>
        <img
          className={Style.bannerImage}
          src={collection?.bannerImageUrl ? collection.bannerImageUrl : 'https://via.placeholder.com/200'}
          alt="banner"
        />
      </div>
      <div className={Style.infoContainer}>
        <div className={Style.midRow}>
          <img
            className={Style.profileImg}
            src={collection?.imageUrl ? collection.imageUrl : 'https://via.placeholder.com/200'}
            alt="profile image"
          />
        </div>
        <div className={Style.endRow}>
          <div className={Style.socialIconsContainer}>
            <div className={Style.socialIconsWrapper}>
              {/* <div className={Style.socialIconsContent}>
                <div className={Style.socialIcon}>
                  <CgWebsite />
                </div>
                <div className={Style.divider} />
                <div className={Style.socialIcon}>
                  <AiOutlineInstagram />
                </div>
                <div className={Style.divider} />
                <div className={Style.socialIcon}>
                  <AiOutlineTwitter />
                </div>
                <div className={Style.divider} />
                <div className={Style.socialIcon}>
                  <HiDotsVertical />
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <div className={Style.midRow}>
          <div className={Style.title}>{collection?.title}</div>
        </div>
        <div className={Style.midRow}>
          <div className={Style.createdBy}>
            Created by <span className="text-[#2081e2]">{collection?.creator}</span>
          </div>
        </div>
        <div className={Style.midRow}>
          <div className={Style.statsContainer}>
            <div className={Style.collectionStat}>
              <div className={Style.statValue}>{nfts.length}</div>
              <div className={Style.statName}>items</div>
            </div>
            <div className={Style.collectionStat}>
              <div className={Style.statValue}>
                {collection?.allOwners ? collection.allOwners.length : ''}
              </div>
              <div className={Style.statName}>owners</div>
            </div>
            <div className={Style.collectionStat}>
              <div className={Style.statValue}>
                <img
                  src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                  alt="eth"
                  className={Style.ethLogo}
                />
                {collection?.floorPrice}
              </div>
              <div className={Style.statName}>floor price</div>
            </div>
            <div className={Style.collectionStat}>
              <div className={Style.statValue}>
                <img
                  src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg"
                  alt="eth"
                  className={Style.ethLogo}
                />
                {collection?.volumeTraded}.5K
              </div>
              <div className={Style.statName}>volume traded</div>
            </div>
          </div>
        </div>
        <div className={Style.midRow}>
          <div className={Style.description}>{collection?.description}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-3 py-2.5">
        {nfts.map((nft,i) => (
          <Card key={i} nft={nft} />
        ))}
      </div>
    </div>
  );
};
const Card = ({ nft }) => {
    const setNFT = () => {
      setGlobalState('nft', nft)
      setGlobalState('showModal', 'scale-100')
    }
  
    return (
      <div className="w-full shadow-xl shadow-black rounded-md overflow-hidden bg-gray-800 my-2 p-3">
        <img
          src={nft.metadataURI}
          alt={nft.title}
          className="h-60 w-full object-cover shadow-lg shadow-black rounded-lg mb-3"
        />
        <h4 className="text-white font-semibold">{nft.title}</h4>
        <p className="text-gray-400 text-xs my-1">{nft.description}</p>
        <div className="flex justify-between items-center mt-3 text-white">
          <div className="flex flex-col">
            <small className="text-xs">Current Price</small>
            <p className="text-sm font-semibold">{nft.cost} ETH</p>
          </div>
  
          <button
            className="shadow-lg shadow-black text-white text-sm bg-[#e32970] hover:bg-[#bd255f] cursor-pointer rounded-full px-1.5 py-1"
            onClick={setNFT}
          >
            View Details
          </button>
        </div>
      </div>
    )
  }
export default Portfolio;