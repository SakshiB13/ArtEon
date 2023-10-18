// require('babel-register')
// require('babel-polyfill')
require('dotenv').config()
const HDWalletProvider = require('@truffle/hdwallet-provider')

module.exports = {
  // Configure networks (Localhost, Rinkeby, etc.)
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*', // Match any network id
    },
    // goerli: {
    //   provider: () =>
    //     new HDWalletProvider(process.env.SECRET_KEY, process.env.ENDPOINT_URL),
    //   network_id: 5,
    //   gas: 5500000,
    //   confirmations: 2, // # of confs to wait between deployments. (default: 0)
    //   timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
    //   skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    // },
    sepolia: {
      provider: () =>
        new HDWalletProvider(
          'unique cross peanut timber act hole imitate cancel garlic dress live scale', // Replace with your mnemonic or private key
          'https://sepolia.infura.io/v3/160b7bbd3dea4e8b86a62aa8f8a291e3', // Replace with the Sepolia RPC endpoint
        ),
        network_id: "11155111",
        gas: 1500000,
        timeoutBlocks: 500,
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  // Configure your compilers
  compilers: {
    solc: {
      version: '0.8.21',
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
}
