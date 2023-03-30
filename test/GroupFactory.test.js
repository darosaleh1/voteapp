const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GroupFactory Contract", function () {
  let GroupFactory;
  let groupFactory;
  let owner;
  let addrs;

  beforeEach(async function () {
    GroupFactory = await ethers.getContractFactory("GroupFactory");
    [owner, ...addrs] = await ethers.getSigners();

    groupFactory = await GroupFactory.deploy();
    await groupFactory.deployed();
  });

  it("Should create a new group and add it to createdGroups", async function () {
    const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("password"));

    await groupFactory.createGroup("Test Group", false, hashedPassword);

    const createdGroups = await groupFactory.getDeployedGroups();
    expect(createdGroups.length).to.equal(1);

    const createdGroupAddress = createdGroups[0];
    const createdGroup = await ethers.getContractAt("Group", createdGroupAddress);
    expect(await createdGroup.groupName()).to.equal("Test Group");
  });

  it("Should return the correct list of deployed groups", async function () {
    const GroupFactory = await ethers.getContractFactory("GroupFactory");
    const groupFactory = await GroupFactory.deploy();
    await groupFactory.deployed();
  
    const group1 = await groupFactory.createGroup(
      "Group 1",
      false,
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    );
  
    const group2 = await groupFactory.createGroup(
      "Group 2",
      true,
      "0x0eed5c8a1e6ed1f02c06f9d0e8cfd13da55e314e520a8f61a0b17e9813c3ca80"
    );
  
    const createdGroups = await groupFactory.getDeployedGroups();
    expect(createdGroups.length).to.equal(2);
  
    const group1Instance = await ethers.getContractAt("Group", createdGroups[0]);
    const group2Instance = await ethers.getContractAt("Group", createdGroups[1]);
  
    expect(await group1Instance.groupName()).to.equal("Group 1");
    expect(await group2Instance.groupName()).to.equal("Group 2");
  });
  
});
