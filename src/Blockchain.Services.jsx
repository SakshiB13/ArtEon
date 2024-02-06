import Web3 from 'web3'
import { setGlobalState, getGlobalState, setAlert } from './store'
import abi from './abis/ArtEon.json'

const { ethereum } = window
window.web3 = new Web3(ethereum)
window.web3 = new Web3(window.web3.currentProvider)

const getEtheriumContract = async () => {
  const web3 = window.web3;
  const contractAddress = '0xba064d6a8b11e26aeaac5297a42de07ca48001e7'; 
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
      cost: window.web3.utils.fromWei(nft.cost),
      title: nft.title,
      description: nft.description,
      metadataURI: nft.metadataURI,
      timestamp: nft.timestamp,
    }))
    .reverse()
}

const getAllNFTs = async () => {
 
  try {
    const contract = await getEtheriumContract()
    console.log('hi')
    console.log(contract)
    const nfts = await contract.methods.getAllNFTs().call()
    const transactions = await contract.methods.getAllTransactions().call()

    setGlobalState('nfts', structuredNfts(nfts))
    setGlobalState('transactions', structuredNfts(transactions))
    console.log(nfts)
    console.log("transaction")
    console.log(transactions)
  } catch (error) {
    reportError(error)
  }
}

const burnNFT = async (tokenId) => {
  try {
    const contract = await getEtheriumContract(); // Your function to get the contract
    console.log('Burning NFT...');
    await contract.methods.burn(tokenId).send({ from: "0x599353494e66B64f4631f2e86bD3438D24CE6B89"});
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

      console.log('Mint Transaction:', mintTx);


    return true
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

const reportError = (error) => {
  setAlert(JSON.stringify(error), 'red')
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
}
