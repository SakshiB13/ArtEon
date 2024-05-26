import Web3 from 'web3'
import { setGlobalState, getGlobalState, setAlert } from './store'
import abi from './abis/ArtEon.json'

const { ethereum } = window
window.web3 = new Web3(ethereum)
window.web3 = new Web3(window.web3.currentProvider)

const getEtheriumContract = async () => {
  const web3 = window.web3;
  const contractAddress = '0xb01744a9435a282f5234e9c545ab295a08a5442a'; 
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
      listedForSale: nft.listedForSale,
    }))
    .reverse();
};

const getAllNFTs = async () => {
  try {
    const contract = await getEtheriumContract()
    const nfts = await contract.methods.getAllNFTs().call()
    const transactions = await contract.methods.getAllTransactions().call()
    setGlobalState('nfts', structuredNfts(nfts))
    console.log(nfts);
    setGlobalState('transactions', structuredNfts(transactions))
  } catch (error) {
    reportError(error)
  }
}

const burnNFT = async (tokenId) => {
  try {
    const contract = await getEtheriumContract();
    await contract.methods.burn(tokenId).send({ from: getGlobalState('connectedAccount') });
  } catch (error) {
    reportError(error);
  }
}

const mintNFT = async ({ title, description, metadataURI, price }) => {
  try {
    price = window.web3.utils.toWei(price.toString(),'ether')
    const contract = await getEtheriumContract()
    const account = getGlobalState('connectedAccount')
    const mintPrice = window.web3.utils.toWei('0.01', 'ether')
    
    const mintTx = await contract.methods
      .payToMint(title, description, metadataURI, price)  // Mint without listing for sale initially
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
    cost = window.web3.utils.toWei(cost.toString(), 'ether');
    const contract = await getEtheriumContract();
    const buyer = getGlobalState('connectedAccount');

    await contract.methods
      .payToBuy(Number(id))
      .send({ from: buyer, value: cost })
      .on('transactionHash', function(hash){
        console.log('Transaction hash:', hash);
      })
      .on('receipt', function(receipt){
        console.log('Receipt:', receipt);
      })
      .on('error', function(error, receipt) {
        console.error('Error occurred:', error);
        console.log('Receipt:', receipt);
      });

    return true;
  } catch (error) {
    console.error('Transaction failed with error:', error);
    reportError(error);
    return false;
  }
}

const listForSale = async ({ id, price }) => {
  try {
    price = window.web3.utils.toWei(price.toString(), 'ether');
    const contract = await getEtheriumContract();
    const account = getGlobalState('connectedAccount');

    await contract.methods.listForSale(Number(id), price).send({ from: account });
  } catch (error) {
    reportError(error);
  }
};

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
    const contract = await getEtheriumContract();
    const nfts = await contract.methods.getAllNFTs().call();
    const nftsByAddress = nfts.filter(nft => nft.owner.toLowerCase() === ownerAddress.id);
    setGlobalState('nftsByAddress', structuredNfts(nftsByAddress));
  } catch (error) {
    reportError(error);
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
  listForSale
};
