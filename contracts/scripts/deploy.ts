import { ethers } from "hardhat";

async function main() {
  console.log("Deploying BlueCarbonRegistry contract...");

  // Get the contract factory
  const BlueCarbonRegistry = await ethers.getContractFactory("BlueCarbonRegistry");

  // Deploy the contract
  const registry = await BlueCarbonRegistry.deploy();

  await registry.waitForDeployment();

  const contractAddress = await registry.getAddress();
  console.log("BlueCarbonRegistry deployed to:", contractAddress);

  // Set up initial roles (optional - for testing)
  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  // Grant roles to deployer for testing
  const ADMIN_ROLE = await registry.ADMIN_ROLE();
  const VERIFIER_ROLE = await registry.VERIFIER_ROLE();
  const PROJECT_OWNER_ROLE = await registry.PROJECT_OWNER_ROLE();
  const FIELD_COLLECTOR_ROLE = await registry.FIELD_COLLECTOR_ROLE();

  await registry.grantRole(ADMIN_ROLE, deployer.address);
  await registry.grantRole(VERIFIER_ROLE, deployer.address);
  await registry.grantRole(PROJECT_OWNER_ROLE, deployer.address);
  await registry.grantRole(FIELD_COLLECTOR_ROLE, deployer.address);

  console.log("Initial roles granted to deployer");

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    deployer: deployer.address,
    network: await ethers.provider.getNetwork(),
    timestamp: new Date().toISOString(),
  };

  console.log("Deployment completed successfully!");
  console.log("Contract Address:", deploymentInfo.contractAddress);
  console.log("Network:", deploymentInfo.network.name, "Chain ID:", deploymentInfo.network.chainId);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
