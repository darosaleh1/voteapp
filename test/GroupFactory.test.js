const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GroupFactory", function () {
  let GroupFactory, Group, groupFactory;
  let owner, user1, user2, user3;

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();
    GroupFactory = await ethers.getContractFactory("GroupFactory");
    Group = await ethers.getContractFactory("Group");

    groupFactory = await GroupFactory.deploy();
    await groupFactory.deployed();
  });

  it("Group is created by the factory", async function () {
    // Assuming the hashed password is "password" hashed using keccak256
    const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("password"));
    await groupFactory.connect(owner).createGroup("Test Group", true, hashedPassword);

    const groups = await groupFactory.getDeployedGroups();
    expect(groups.length).to.equal(1);

    const group = await Group.attach(groups[0]);
    const [groupName, isGroupPrivate] = await group.getGroupDetails();

    expect(groupName).to.equal("Test Group");
    expect(isGroupPrivate).to.be.true;
  });

  it("Created group emits an event", async function () {
    // Assuming the hashed password is "password" hashed using keccak256
    const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("password"));

    await expect(groupFactory.connect(owner).createGroup("Test Group", true, hashedPassword))
      .to.emit(groupFactory, "GroupCreated");
  });

  it("User groups are updated on joining a group", async function () {
    // Assuming the hashed password is "password" hashed using keccak256
    const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("password"));
    await groupFactory.connect(owner).createGroup("Test Group", true, hashedPassword);

    const groups = await groupFactory.getDeployedGroups();
    const group = await Group.attach(groups[0]);

    await group.connect(owner).addMember(user1.address);

    const user1Groups = await groupFactory.getUserGroups(user1.address);
    expect(user1Groups.length).to.equal(1);
    expect(user1Groups[0]).to.equal(group.address);
  });

  it("User groups are updated on leaving a group", async function () {
    // Assuming the hashed password is "password" hashed using keccak256
    const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("password"));
    await groupFactory.connect(owner).createGroup("Test Group", true, hashedPassword);

    const groups = await groupFactory.getDeployedGroups();
    const group = await Group.attach(groups[0]);

    await group.connect(owner).addMember(user1.address);
    await group.connect(user1).leaveGroup();

    const user1Groups = await groupFactory.getUserGroups(user1.address);
    expect(user1Groups.length).to.equal(0);
  });

  it("Multiple groups can be created and users can join different groups", async function () {
    // Assuming the hashed password is "password" hashed using keccak256
    const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("password"));
    await groupFactory.connect(owner).createGroup("Test Group 1", true, hashedPassword);
    await groupFactory.connect(owner).createGroup("Test Group 2", false, hashedPassword);

    const groups = await groupFactory.getDeployedGroups();
    const group1 = await Group.attach(groups[0]);
    const group2 = await Group.attach(groups[1]);

    await group1.connect(owner).addMember(user1.address);
    await group2.connect(owner).addMember(user1.address);

    const user1Groups = await groupFactory.getUserGroups(user1.address);
    expect(user1Groups.length).to.equal(2);
    expect(user1Groups[0]).to.equal(group1.address);
    expect(user1Groups[1]).to.equal(group2.address);
  });

  it("Cannot create group with an empty name", async function () {
    const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("password"));
    await expect(groupFactory.connect(owner).createGroup("", true, hashedPassword)).to.be.revertedWith(
      "Group name cannot be empty!"
    );
  });
  
  it("Cannot create group with the same name", async function () {
    const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("password"));
    await groupFactory.connect(owner).createGroup("Test Group", true, hashedPassword);
    await expect(groupFactory.connect(owner).createGroup("Test Group", true, hashedPassword)).to.be.revertedWith(
      "Group name already exists!"
    );
  });

  it("Returns an empty array for users with no groups", async function () {
    const newUser = user1;
    const userGroups = await groupFactory.getUserGroups(newUser.address);
    expect(userGroups.length).to.equal(0);
  });
  
  
  

  it("Returns correct groups for a user who has joined multiple groups", async function () {
    // Create three groups
    const hashedPasswords = [
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("password1")),
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("password2")),
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("password3"))
    ];
  
    await groupFactory.connect(owner).createGroup("Group 1", true, hashedPasswords[0]);
    await groupFactory.connect(owner).createGroup("Group 2", true, hashedPasswords[1]);
    await groupFactory.connect(owner).createGroup("Group 3", true, hashedPasswords[2]);
  
    const createdGroups = await groupFactory.getDeployedGroups();
  
    // User joins the three groups
    const user = user3;
    for (let i = 0; i < createdGroups.length; i++) {
      const group = await ethers.getContractAt("Group", createdGroups[i]);
      await group.connect(user).joinGroup(hashedPasswords[i]);
    }
  
    // Check if the user's groups match the created groups
    const userGroups = await groupFactory.getUserGroups(user.address);
    expect(userGroups.length).to.equal(createdGroups.length);
  
    for (let i = 0; i < userGroups.length; i++) {
      expect(userGroups[i]).to.equal(createdGroups[i]);
    }
  });
  
});

