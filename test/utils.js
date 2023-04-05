const { ethers } = require("hardhat");

async function deployGroupFactory() {
  const GroupFactory = await ethers.getContractFactory("GroupFactory");
  return await GroupFactory.deploy();
}

const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test-password"));

module.exports = {
  deployGroupFactory,
  hashedPassword,
};
