
const hre = require("hardhat");

async function main() {
 


  const Poll = await hre.ethers.getContractFactory("Poll");
  const poll = await Poll.deploy() 

  await poll.deployed();

  console.log(
    `Lock with 1 ETH deployed to ${poll.address}`
  );

  console.log(poll);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
