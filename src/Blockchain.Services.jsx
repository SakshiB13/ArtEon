import Web3 from 'web3'
import { setGlobalState, getGlobalState, setAlert } from './store'
import abi from './abis/ArtEon.json'

const { ethereum } = window
window.web3 = new Web3(ethereum)
window.web3 = new Web3(window.web3.currentProvider)

const getEtheriumContract = async () => {
  const web3 = window.web3;
  const contractAddress = '0xf5b7d3f6b77978e8b6cd2972004b79ed2090d9e6'; 
  const contract = new web3.eth.Contract(abi.output.abi, contractAddress);
  return contract;
}


const connectWallet = async () => {
  try {
    if (!ethereum) return reportError('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    setGlobalState('connectedAccount', accounts[0].toLowerCase())
  } catch (error) {
    reportError(error)
  }
}

const isWalletConnected = async () => {
  if (!ethereum) {
    reportError('Please install Metamask');
  } else {
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log(accounts[0])
      window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload();
      });
  
      window.ethereum.on('accountsChanged', async () => {
        if (accounts.length > 0) {
          setGlobalState('connectedAccount', accounts[0].toLowerCase());
        } else {
          setGlobalState('connectedAccount', '');
          reportError('Please connect a wallet.');
        }
        await isWalletConnected();
      });
  
      if (accounts.length > 0) {
        setGlobalState('connectedAccount', accounts[0].toLowerCase());
      } else {
        setGlobalState('connectedAccount', '');
        reportError('Please connect a wallet.');
      }
    } catch (error) {
      reportError(error);
    }
  }
  
}
/* const getAllNFTs = async () => {
  try {
    const contract = await getEtheriumContract();
    const nfts = await contract.methods.getAllNFTs().call();
    const transactions = await contract.methods.getAllTransactions().call(); */

const structuredNfts = (nfts) => {
  return nfts
    .map((nft) => ({
      id: Number(nft.id),
      owner: nft.owner.toLowerCase(),
      cost: nft.cost ? window.web3.utils.fromWei(nft.cost.toString(), 'ether') : 'N/A',
      title: nft.title,
      description: nft.description,
      metadataURI: nft.metadataURI,
      timestamp: nft.timestamp,
    }))
    .reverse();
};
const getAllNFTs = async () => {
 
  try {
    const contract = await getEtheriumContract()
    console.log('hi')
    console.log(contract)
    const nfts = await contract.methods.getAllNFTs().call()
    const transactions = await contract.methods.getAllTransactions().call()
    console.log(nfts)
    console.log("transaction")
    console.log(transactions)
    setGlobalState('nfts', structuredNfts(nfts))
    setGlobalState('transactions', structuredNfts(transactions))
    
  } catch (error) {
    reportError(error)
  }
}

const burnNFT = async (tokenId) => {
  try {
    const contract = await getEtheriumContract(); // Your function to get the contract
    console.log('Burning NFT...');
    await contract.methods.burn(tokenId).send({ from: "0x8788d03410f529863Dc7E7BB7F5cB49bF9BfA486"});
    console.log('NFT burned successfully.');
  } catch (error) {
    reportError(error);
  }
}


const mintNFT = async ({ title, description, metadataURI, price }) => {
  try {
    price = window.web3.utils.toWei(price.toString(), 'ether')
    const contract = await getEtheriumContract()
    const account = getGlobalState('connectedAccount')
    const mintPrice = window.web3.utils.toWei('0.01', 'ether')

    const mintTx = await contract.methods
      .payToMint(title, description, metadataURI, price)
      .send({ from: account, value: mintPrice });
      const tokenId = mintTx.events.Sale.returnValues[0];
      console.log('Token id', tokenId);


    return tokenId;
  } catch (error) {
    reportError(error)
  }
}

const buyNFT = async ({ id, cost }) => {
  try {
    cost = window.web3.utils.toWei(cost.toString(), 'ether')
    const contract = await getEtheriumContract()
    const buyer = getGlobalState('connectedAccount')

    await contract.methods
      .payToBuy(Number(id))
      .send({ from: buyer, value: cost })

    return true
  } catch (error) {
    reportError(error)
  }
}

const updateNFT = async ({ id, cost }) => {
  try {
    cost = window.web3.utils.toWei(cost.toString(), 'ether')
    const contract = await getEtheriumContract()
    const buyer = getGlobalState('connectedAccount')

    await contract.methods.changePrice(Number(id), cost).send({ from: buyer })
  } catch (error) {
    reportError(error)
  }
}

const getNFTsByAddress = async (ownerAddress) => {
  try {
    //console.log(ownerAddress)
    const contract = await getEtheriumContract();
    const nfts = await contract.methods.getAllNFTs().call();
    console.log("All NFTs:", nfts);
    console.log("Owner Address:", ownerAddress);
    const nftsByAddress = nfts.filter(nft => nft.owner.toLowerCase() === ownerAddress.id);
    setGlobalState('nftsByAddress', structuredNfts(nftsByAddress));
    console.log("NFTs filtered by address:", structuredNfts(nftsByAddress));

    //console.log(nftsByAddress);
  } catch (error) {
    reportError(error);
  }
}


//create auction
const createAuction = async ({ tokenId, price, startDate, endDate }) => {
  try {
    console.log('createauction');
    console.log(tokenId,price, startDate, endDate);
    const contract = await getEtheriumContract();
    const account = getGlobalState('connectedAccount');

    await contract.methods
      .createAuction(tokenId, price, startDate, endDate)
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
    const buyer = getGlobalState('connectedAccount');
    const contract = await getEtheriumContract();
    await contract.methods.placeBid(auctionId).send({ from: buyer, value: bidAmount });
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

const structuredAuctions = (auctions) => {
  return auctions
    .map((auction) => ({
      id: Number(auction.id),
      tokenId:Number(auction.tokenId),
      seller: auction.seller.toLowerCase(),
      startPrice: auction.startPrice ? window.web3.utils.fromWei(auction.startPrice.toString(), 'ether') : 'N/A',
      currentBid: auction.currentBid ? window.web3.utils.fromWei(auction.currentBid.toString(), 'ether') : 'N/A',
      currentBidder: auction.currentBidder.toLowerCase(),
      startTime: auction.startTime,
      endTime: auction.endTime,
      active: auction.active,
        }))
    
};
const getAllAuctions = async () => {
  try {
    const contract = await getEtheriumContract(); 
    const auctions = await contract.methods.getAllAuctions().call(); 
    console.log('All Auctions:', structuredAuctions(auctions));
    setGlobalState('auctions', structuredAuctions(auctions))
    return structuredAuctions(auctions);
  } catch (error) {
    reportError(error);
    return [];
  }
}


const reportError = (error) => {
  console.log(error);
}

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
  getAllAuctions,
};

  
