require("@nomicfoundation/hardhat-toolbox");

const ALCHEMY_API_KEY = "5-Bb4CdRKYiASC5FHAOcNCx3rPowChzi";

const SEPOLIA_PRIVATE_KEY = "c0cf203385573aee8a5f35d40d188fc588ae007475af1e26ca1a5c342b534858";



/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  }
};
