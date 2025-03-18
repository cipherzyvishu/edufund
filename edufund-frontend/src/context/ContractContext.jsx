import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import EduFundABI from "../abis/EduFund.json";

// Ensure the ABI file exists
import { EduFundAddress } from "../config"; // Ensure contract address is correct

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [fundraisers, setFundraisers] = useState([]);

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

      // Initialize contract
      const contractInstance = new ethers.Contract(
        EduFundAddress,
        EduFundABI.abi,
        web3Signer
      );
      setContract(contractInstance);
      console.log("Connected to EduFund Contract:", EduFundAddress);

      await fetchFundraisers(); // Fetch fundraisers after wallet connects
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  const fetchFundraisers = async () => {
    if (!contract) {
      console.warn("Contract is not initialized yet!");
      return;
    }

    try {
      const count = await contract.fundraiserCount();
      console.log("Total Fundraisers:", count.toString());

      if (count === 0) {
        console.warn("No fundraisers found.");
        setFundraisers([]); // Clear fundraisers list
        return;
      }

      let fundraisersArray = [];
      for (let i = 0; i < count; i++) {
        const fundraiser = await contract.getFundraiser(i);
        console.log(`Fundraiser ${i}:`, fundraiser);

        fundraisersArray.push({
          id: i,
          name: fundraiser[0], // Ensure the correct indexing
          description: fundraiser[1],
          goal: ethers.formatEther(fundraiser[2]),
          amountRaised: ethers.formatEther(fundraiser[3]),
          beneficiary: fundraiser[4],
          isClosed: fundraiser[5],
        });
      }

      setFundraisers(fundraisersArray);
      console.log("Fetched Fundraisers:", fundraisersArray);
    } catch (error) {
      console.error("Error fetching fundraisers:", error);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchFundraisers();
    }
  }, [contract, account]);

  return (
    <ContractContext.Provider
      value={{
        provider,
        signer,
        contract,
        account,
        connectWallet,
        fundraisers,
        fetchFundraisers, // Make it accessible from components
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => useContext(ContractContext);
