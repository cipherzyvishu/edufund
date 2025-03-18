import React, { useState } from "react";
import { useContract } from "../context/ContractContext";
import { ethers } from "ethers";

const CreateFundraiser = () => {
  const { contract, signer, fetchFundraisers } = useContract();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateFundraiser = async (e) => {
    e.preventDefault();
    if (!contract || !signer) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      setLoading(true);
      const goalInWei = ethers.parseEther(goal); // Convert ETH to Wei
      const tx = await contract.createFundraiser(
        name,
        description,
        goalInWei,
        beneficiary
      );
      await tx.wait();
      alert("Fundraiser created successfully!");
      fetchFundraisers(); // Refresh the fundraiser list
      setName("");
      setDescription("");
      setGoal("");
      setBeneficiary("");
    } catch (error) {
      console.error("Error creating fundraiser:", error);
      alert("Failed to create fundraiser.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-4">Create a Fundraiser</h2>
      <form
        onSubmit={handleCreateFundraiser}
        className="flex flex-col space-y-4"
      >
        <input
          type="text"
          placeholder="Fundraiser Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="number"
          placeholder="Goal Amount (EDU)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Beneficiary Address"
          value={beneficiary}
          onChange={(e) => setBeneficiary(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-500 font-bold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          {loading ? "Creating..." : "Create Fundraiser"}
        </button>
      </form>
    </div>
  );
};

export default CreateFundraiser;
