import React from "react";
import { useContract } from "../context/ContractContext";
import Donate from "./Donate";
import Withdraw from "./Withdraw";

const FundraiserList = () => {
  const { fundraisers, account } = useContract();

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Active Fundraisers
      </h2>

      {fundraisers.length === 0 ? (
        <p className="text-gray-400 text-center">No fundraisers available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fundraisers.map((fundraiser, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg shadow-lg text-white"
            >
              <h3 className="text-xl font-bold">{fundraiser.name}</h3>
              <p className="text-gray-400">{fundraiser.description}</p>
              <p className="mt-2">
                <span className="font-semibold">Goal:</span> {fundraiser.goal}{" "}
                EDU
              </p>
              <p>
                <span className="font-semibold">Raised:</span>{" "}
                {fundraiser.amountRaised} EDU
              </p>
              <p className="text-sm mt-2">
                <span className="font-semibold">Beneficiary:</span>{" "}
                <span className="break-all">{fundraiser.beneficiary}</span>
              </p>

              {/* Fundraiser Status */}
              <p
                className={`mt-2 text-sm ${
                  fundraiser.isClosed ? "text-red-400" : "text-green-400"
                }`}
              >
                {fundraiser.isClosed
                  ? "Closed - Funds Withdrawn ❌"
                  : "Active ✅"}
              </p>

              {/* Donate Component */}
              {!fundraiser.isClosed && <Donate fundraiserId={index} />}

              {/* Withdraw Button (Only for Beneficiary & Active Fundraisers) */}
              {account === fundraiser.beneficiary && !fundraiser.isClosed && (
                <Withdraw fundraiserId={index} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FundraiserList;
