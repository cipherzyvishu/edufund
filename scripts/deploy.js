const hre = require("hardhat");

async function main() {
  // Get the Contract Factory
  const EduFund = await hre.ethers.getContractFactory("EduFund");

  console.log("Deploying EduFund contract...");

  // Deploy the contract
  const eduFund = await EduFund.deploy();
  await eduFund.waitForDeployment(); // Corrected for Ethers v6

  // Get the deployed contract address
  const contractAddress = await eduFund.getAddress();

  console.log("EduFund deployed to:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
