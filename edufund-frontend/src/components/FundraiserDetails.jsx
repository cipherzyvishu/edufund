import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useContract } from "../context/ContractContext";

const FundraiserDetails = () => {
  const { fundraisers, donateToFundraiser, withdrawFunds, fetchFundraisers } =
    useContract();
  const { id } = useParams();
  const fundraiser = fundraisers.find((f) => f.id === parseInt(id));
  const [donationAmount, setDonationAmount] = useState("");

  if (!fundraiser)
    return (
      <p className="text-white text-center mt-10">⚠️ Fundraiser not found.</p>
    );

  const handleWithdraw = async () => {
    try {
      await withdrawFunds(fundraiser.id);
      await fetchFundraisers(); // Refresh fundraiser data after withdrawal
    } catch (error) {
      console.error("Withdrawal failed:", error);
    }
  };

  return (
    <div className="p-10 bg-gray-900 min-h-screen text-white flex flex-col items-center">
      <h2 className="text-3xl font-bold">{fundraiser.name}</h2>
      <p className="text-gray-400 mt-2">{fundraiser.description}</p>
      <p className="mt-4">
        🎯 <strong>Goal:</strong> {fundraiser.goal} EDU
      </p>
      <p>
        💰 <strong>Raised:</strong> {fundraiser.amountRaised} EDU
      </p>
      <p>
        👤 <strong>Beneficiary:</strong> {fundraiser.beneficiary}
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {!fundraiser.isClosed && (
          <>
            <input
              type="number"
              placeholder="Enter amount in EDU"
              className="p-2 rounded bg-gray-800 text-white border border-gray-600"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
            />
            <button
              onClick={() => donateToFundraiser(fundraiser.id, donationAmount)}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-700 rounded"
            >
              Donate
            </button>
          </>
        )}

        {/* Show correct status messages */}
        {fundraiser.isClosed ? (
          <p className="text-red-500 flex items-center">
            🚫 Closed - Funds Withdrawn
          </p>
        ) : fundraiser.amountRaised >= fundraiser.goal ? (
          <button
            onClick={handleWithdraw}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            ✅ Withdraw Funds
          </button>
        ) : (
          <p className="text-yellow-500">
            ⏳ Fundraiser Open - Awaiting Donations
          </p>
        )}
      </div>
    </div>
  );
};

export default FundraiserDetails;
