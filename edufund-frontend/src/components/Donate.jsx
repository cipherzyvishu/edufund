import React, { useState } from "react";
import { useContract } from "../context/ContractContext";
import { ethers } from "ethers";

const Donate = ({ fundraiserId }) => {
  const { contract, fetchFundraisers } = useContract();
  const [amount, setAmount] = useState("");

  const handleDonate = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    try {
      const tx = await contract.donate(fundraiserId, {
        value: ethers.parseEther(amount),
      });
      await tx.wait();

      alert("Donation successful!");
      setAmount(""); // Clear input
      fetchFundraisers(); // Refresh fundraisers
    } catch (error) {
      console.error("Donation failed:", error);
      alert("Donation failed. Please try again.");
    }
  };

  return (
    <div className="mt-4 flex flex-col">
      <input
        type="number"
        placeholder="Enter amount (EDU)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="px-4 py-2 border border-gray-500 rounded-md text-white"
      />
      <button
        onClick={handleDonate}
        className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        Donate
      </button>
    </div>
  );
};

export default Donate;
