import React, { useState } from "react";
import { useContract } from "../context/ContractContext";

const Withdraw = ({ fundraiserId, isClosed }) => {
  const { contract, fetchFundraisers, account } = useContract();
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    try {
      setLoading(true);
      const tx = await contract.withdrawFunds(fundraiserId);
      await tx.wait();

      alert("Funds withdrawn successfully!");
      fetchFundraisers(); // Refresh fundraiser details
    } catch (error) {
      console.error("Withdrawal failed:", error);
      alert(
        "Withdrawal failed. Ensure you are the beneficiary and the goal is met."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      {isClosed ? (
        <p className="text-yellow-400">Funds already withdrawn.</p>
      ) : (
        <button
          onClick={handleWithdraw}
          disabled={loading}
          className={`px-4 py-2 rounded-lg ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-700"
          } text-white`}
        >
          {loading ? "Processing..." : "Withdraw Funds"}
        </button>
      )}
    </div>
  );
};

export default Withdraw;
