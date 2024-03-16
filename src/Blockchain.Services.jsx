import Web3 from 'web3';
import { setGlobalState, getGlobalState, setAlert } from './store';
import abi from './abis/ArtEon.json';

const { ethereum } = window;


// Create a new Web3 instance using the injected provider
const web3 = new Web3(ethereum);

const getEtheriumContract = async () => {
  const web3 = window.web3;
  const contractAddress = '0xff0e665cee8913a8adf2cdd6072d6b70d4367fac'; 
  const contract = new web3.eth.Contract(abi.output.abi, contractAddress);
  return contract;
}

const getAllNFTs = async () => {
  try {
    const contract = await getEtheriumContract();
    const nfts = await contract.methods.getAllNFTs().call();
    const transactions = await contract.methods.getAllTransactions().call();

    const structuredNfts = nfts.map((nft) => ({
      id: Number(nft.id),
      owner: nft.owner.toLowerCase(),
      cost: web3.utils.fromWei(nft.cost.toString(), 'ether'),
      title: nft.title,
      description: nft.description,
      metadataURI: nft.metadataURI,
      timestamp: nft.timestamp,
    })).reverse();

    const structuredTransactions = transactions.map((transaction) => ({
      // Assuming similar structure to NFTs for transactions
      // Adjust as necessary
      // Example:
      id: Number(transaction.id),
      // other properties...
    })).reverse();

    setGlobalState('nfts', structuredNfts);
    setGlobalState('transactions', structuredTransactions);

    return structuredNfts; // Optionally return the structured NFTs
  } catch (error) {
    throw new Error(`Error fetching NFTs: ${error}`);
  }
};

const connectWallet = async () => {
  try {
    if (!ethereum) throw new Error('Please install Metamask');
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    setGlobalState('connectedAccount', accounts[0].toLowerCase());
  } catch (error) {
    throw new Error(error);
  }
};

const isWalletConnected = async () => {
  try {
    if (!ethereum) throw new Error('Please install Metamask');
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    });

    window.ethereum.on('accountsChanged', async () => {
      if (accounts.length > 0) {
        setGlobalState('connectedAccount', accounts[0].toLowerCase());
      } else {
        setGlobalState('connectedAccount', '');
        throw new Error('Please connect a wallet.');
      }
      await isWalletConnected();
    });

    if (accounts.length > 0) {
      setGlobalState('connectedAccount', accounts[0].toLowerCase());
    } else {
      setGlobalState('connectedAccount', '');
      throw new Error('Please connect a wallet.');
    }
  } catch (error) {
    throw new Error(error);
  }
};

const mintNFT = async ({ title, description, metadataURI, price }) => {
  try {
    price = web3.utils.toWei(price.toString(), 'ether');
    const contract = await getEtheriumContract();
    const account = getGlobalState('connectedAccount');
    const mintPrice = web3.utils.toWei('0.01', 'ether');

    const mintTx = await contract.methods
      .payToMint(title, description, metadataURI, price)
      .send({ from: account, value: mintPrice });

    console.log('Mint Transaction:', mintTx);

    return true;
  } catch (error) {
    throw new Error(error);
  }
};

const buyNFT = async ({ id, cost }) => {
  try {
    cost = web3.utils.toWei(cost.toString(), 'ether');
    const contract = await getEtheriumContract();
    const buyer = getGlobalState('connectedAccount');

    await contract.methods
      .payToBuy(Number(id))
      .send({ from: buyer, value: cost });

    return true;
  } catch (error) {
    throw new Error(error);
  }
};

const updateNFT = async ({ id, cost }) => {
  try {
    cost = web3.utils.toWei(cost.toString(), 'ether');
    const contract = await getEtheriumContract();
    const buyer = getGlobalState('connectedAccount');

    await contract.methods.changePrice(Number(id), cost).send({ from: buyer });
  } catch (error) {
    throw new Error(error);
  }
};

const getNFTsByAddress = async (ownerAddress) => {
  try {
    console.log(ownerAddress);
    const contract = await getEtheriumContract();
    const nfts = await contract.methods.getAllNFTs().call();
    console.log("All NFTs:", nfts);
    console.log("Owner Address:", ownerAddress);
    const nftsByAddress = nfts.filter(nft => nft.owner === ownerAddress.id);
    setGlobalState('nftsByAddress', nftsByAddress);
    console.log("NFTs filtered by address:", nftsByAddress);
  } catch (error) {
    throw new Error(error);
  }
};


const burnNFT = async (tokenId) => {
  try {
    const contract = await getEtheriumContract();
    console.log('Burning NFT...');
    await contract.methods.burn(tokenId).send({ from: "0x8788d03410f529863Dc7E7BB7F5cB49bF9BfA486"});
    console.log('NFT burned successfully.');
  } catch (error) {
    throw new Error(error);
  }
};

//create auction
const createAuction = async ({ tokenId, startPrice, startTime, endTime }) => {
  try {
    const contract = await getEtheriumContract();
    const account = getGlobalState('connectedAccount');

    await contract.methods
      .createAuction(tokenId, startPrice, startTime, endTime)
      .send({ from: account });

    return true;
  } catch (error) {
    reportError(error);
  }
}
//place bid
const placeBid = async (auctionId, bidAmount) => {
  try {
    bidAmount = window.web3.utils.toWei(bidAmount.toString(), 'ether');
    const contract = await getEtheriumContract();
    await contract.methods.placeBid(auctionId).send({ from: yourWalletAddress, value: bidAmount });
    console.log('Bid successfully placed.');
    return true;
  } catch (error) {
    console.error('Error placing bid:', error);
    return false;
  }
}
//end auction
const endAuction = async (auctionId) => {
  try {
    const contract = await getEtheriumContract();
    const account = getGlobalState('connectedAccount');

    await contract.methods
      .endAuction(auctionId)
      .send({ from: account });

    return true;
  } catch (error) {
    reportError(error);
  }
}



const reportError = (error) => {
  console.log(error);
};

export {
  getAllNFTs,
  connectWallet,
  mintNFT,
  buyNFT,
  updateNFT,
  isWalletConnected,
  getEtheriumContract,
  burnNFT,
  getNFTsByAddress,
  createAuction,
  placeBid,
  endAuction,
};

