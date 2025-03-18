import React from "react";
import { useContract } from "./context/ContractContext";
import CreateFundraiser from "./components/CreateFundraiser";
import FundraiserList from "./components/FundraiserList";

const App = () => {
  const { account, connectWallet } = useContract();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">EduFund DeFi</h1>
      {account ? (
        <>
          <p className="text-lg">Connected: {account}</p>
          <CreateFundraiser />
          <FundraiserList />
        </>
      ) : (
        <button
          onClick={connectWallet}
          className="px-6 py-3 mt-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default App;
