import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal();
      const instance = await web3Modal.connect();
      const web3Provider = new ethers.BrowserProvider(instance);
      const web3Signer = await web3Provider.getSigner();
      const userAccount = await web3Signer.getAddress();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(userAccount);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  return (
    <Web3Context.Provider value={{ provider, signer, account, connectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
