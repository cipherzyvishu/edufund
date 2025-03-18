require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // For securely storing private key

module.exports = {
  solidity: "0.8.20",
  networks: {
    educhain: {
      url: process.env.EDUCHAIN_RPC, // EduChain RPC URL from .env
      accounts: [process.env.PRIVATE_KEY], // Your wallet private key
    },
  },
};
