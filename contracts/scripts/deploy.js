const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // 1. Deploy O8Token
  console.log("\n1. Deploying O8Token...");
  const O8Token = await hre.ethers.getContractFactory("O8Token");
  const token = await O8Token.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("   O8Token deployed to:", tokenAddress);

  // 2. Deploy O8Registry
  console.log("\n2. Deploying O8Registry...");
  const O8Registry = await hre.ethers.getContractFactory("O8Registry");
  const registry = await O8Registry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("   O8Registry deployed to:", registryAddress);

  // 3. Deploy O8Score
  console.log("\n3. Deploying O8Score...");
  const O8Score = await hre.ethers.getContractFactory("O8Score");
  const score = await O8Score.deploy(registryAddress);
  await score.waitForDeployment();
  const scoreAddress = await score.getAddress();
  console.log("   O8Score deployed to:", scoreAddress);

  // 4. Set rewards distributor on token
  console.log("\n4. Setting rewards distributor...");
  await token.setRewardsDistributor(registryAddress);
  console.log("   Rewards distributor set to registry");

  console.log("\n════════════════════════════════════════════");
  console.log("Ø8 PROTOCOL DEPLOYMENT COMPLETE");
  console.log("════════════════════════════════════════════");
  console.log("O8Token:    ", tokenAddress);
  console.log("O8Registry: ", registryAddress);
  console.log("O8Score:    ", scoreAddress);
  console.log("════════════════════════════════════════════\n");

  // Return addresses for verification/testing
  return {
    token: tokenAddress,
    registry: registryAddress,
    score: scoreAddress,
  };
}

main()
  .then((addresses) => {
    console.log("Deployed addresses:", JSON.stringify(addresses, null, 2));
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
