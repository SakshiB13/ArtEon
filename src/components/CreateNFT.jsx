import {
  useGlobalState,
  setGlobalState,
  setLoadingMsg,
  setAlert,
} from '../store';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { create } from 'ipfs-http-client';
import { mintNFT } from '../Blockchain.Services';
//const { getHash } = require('img-hasher');

const auth =
  'Basic ' +
  Buffer.from(
    '2WoJmlP3wUJFD0jXvjNuaBcvHGP' + ':' + '20d129d7a1a55ed8a18994d064b24d1f',
  ).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

// Function to compute perceptual hash from an image
// async function computePerceptualHash(imageData) {
//   try {
//     const hash = await getHash(imageData);
//     return hash;
//   } catch (error) {
//     console.error('Error computing perceptual hash:', error);
//     return null;
//   }
// }

const CreateNFT = () => {
  const [modal] = useGlobalState('modal');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [imgBase64, setImgBase64] = useState(null);
  const [mintednfts] = useGlobalState('nfts');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !price || !description) return;

    setGlobalState('modal', 'scale-0');
    setGlobalState('loading', { show: true, msg: 'Uploading IPFS data...' });

    try {
      const created = await client.add(fileUrl);
      const metadataURI = `https://ipfs.io/ipfs/${created.path}`;

      const nft = { title, price, description, metadataURI };
      console.log(nft);

      // Uncomment the following line if you want to display a loading message
      setLoadingMsg('Verifying Art...');

      // Uncomment the following block if you want to check for existing mintednfts
      /* let exists = false;
      if (mintednfts) {
        for (let i = 0; i < mintednfts.length; i++) {
          if (mintednfts[i].metadataURI === metadataURI) {
            exists = true;
            break;
          }
        }
      } */

      //Uncomment the following block if you want to handle existing mintednfts
    
        setLoadingMsg('Initializing transaction...');
        setFileUrl(metadataURI);
        await mintNFT(nft);
        resetForm();
        setAlert('Minting completed...', 'green');
        window.location.reload();
    } catch (error) {
      console.log('Error uploading file: ', error);
      setAlert('Minting failed...', 'red');
    }
  };


  const changeImage = async (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);

    reader.onload = (readerEvent) => {
      const file = readerEvent.target.result;
      setImgBase64(file);
      setFileUrl(e.target.files[0]);
    };
  };

  const closeModal = () => {
    setGlobalState('modal', 'scale-0');
    resetForm();
  };

  const resetForm = () => {
    setFileUrl('');
    setImgBase64(null);
    setTitle('');
    setPrice('');
    setDescription('');
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center
        justify-center bg-black bg-opacity-50 transform
        transition-transform duration-300 ${modal}`}
    >
      <div className="bg-[#151c25] shadow-xl shadow-[#e32970] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold text-gray-400">Add NFT</p>
            <button
              type="button"
              onClick={closeModal}
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          <div className="flex flex-row justify-center items-center rounded-xl mt-5">
            <div className="shrink-0 rounded-xl overflow-hidden h-20 w-20">
              <img
                alt="NFT"
                className="h-full w-full object-cover cursor-pointer"
                src={
                  imgBase64 ||
                  'https://img.freepik.com/free-photo/multi-colored-butterfly-flies-among-vibrant-nature-beauty-generated-by-ai_188544-19743.jpg?w=740&t=st=1697629772~exp=1697630372~hmac=b368ef612bf3e73809494313735de8ebd37eea2d546e0afd0be03ecc02c5f385'
                }
              />
            </div>
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
              <input
                type="file"
                accept="image/png, image/gif, image/jpeg, image/webp"
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-[#19212c] file:text-gray-400
                  hover:file:bg-[#1d2631]
                  cursor-pointer focus:ring-0 focus:outline-none"
                onChange={changeImage}
                required
              />
            </label>
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <input
              className="block w-full text-sm
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0"
              type="text"
              name="title"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              required
            />
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <input
              className="block w-full text-sm
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0"
              type="number"
              step={0.01}
              min={0.01}
              name="price"
              placeholder="Price (Eth)"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <textarea
              className="block w-full text-sm resize-none
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0 h-20"
              type="text"
              name="description"
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="flex flex-row justify-center items-center
              w-full text-white text-md bg-[#800080] hover:bg-[#b300b3] py-2 px-5 rounded-full
              drop-shadow-xl border border-transparent
              hover:bg-transparent hover:text-[#800080]
              hover:border hover:border-[#b300b3]
              focus:outline-none focus:ring mt-5"
          >
            Mint Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNFT;