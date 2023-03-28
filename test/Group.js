const { expect } = require("chai");

describe("Group", function () {

  it("Should return true if the creator checks their membership using checkMembership", async function () {
    // Get the contract factory
    const Group = await ethers.getContractFactory("Group");

    // Deploy a new Group contract instance
    const groupName = "Test Group";
    const isGroupPrivate = false;
    const hashedPassword = ethers.utils.formatBytes32String("");
    const salt = ethers.utils.formatBytes32String("");
    const [owner, addr1] = await ethers.getSigners();

    const group = await Group.deploy(groupName, isGroupPrivate, hashedPassword, salt);
    await group.deployed();

    // Check if the creator is a member of the group using checkMembership function
    expect(await group.checkMembership(owner.address)).to.equal(true);
});


  it("Should set the correct group name and privacy when created", async function () {
    // Get the contract factory
    const Group = await ethers.getContractFactory("Group");

    // Deploy a new Group contract instance
    const groupName = "Test Group";
    const isGroupPrivate = false;
    const hashedPassword = ethers.utils.formatBytes32String("");
    const salt = ethers.utils.formatBytes32String("");
    const group = await Group.deploy(groupName, isGroupPrivate, hashedPassword, salt);

    // Check if the deployed contract has the correct group name and privacy
    expect(await group.groupName()).to.equal(groupName);
    expect(await group.isGroupPrivate()).to.equal(isGroupPrivate);
  });
});


