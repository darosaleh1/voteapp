const hre = require("hardhat");

async function main() {
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

