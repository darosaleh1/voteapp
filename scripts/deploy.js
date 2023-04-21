const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contract with the account:", deployer.address);

  const GroupFactory = await hre.ethers.getContractFactory("GroupFactory");
  const groupFactory = await GroupFactory.deploy();
  await groupFactory.deployed();

  console.log("GroupFactory deployed to:", groupFactory.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

