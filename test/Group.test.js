const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Group", function () {

  let GroupFactory, Group, Poll, groupFactory, group;
  let owner, user1, user2, user3;

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();
    GroupFactory = await ethers.getContractFactory("GroupFactory");
    Group = await ethers.getContractFactory("Group");
    Poll = await ethers.getContractFactory("Poll");

    groupFactory = await GroupFactory.deploy();
    await groupFactory.deployed();

    // Assuming the hashed password is "password" hashed using keccak256
    const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("password"));
    await groupFactory.connect(owner).createGroup("Test Group", true, hashedPassword);

    // Get the address of the deployed Group contract
    const groupAddress = (await groupFactory.getDeployedGroups())[0];
    group = await Group.attach(groupAddress);
  });

  it("Group is created correctly", async function () {
    const [groupName, isGroupPrivate] = await group.getGroupDetails();
  
    expect(groupName).to.equal("Test Group");
    expect(isGroupPrivate).to.be.true;
    expect(await group.memberCount()).to.equal(1);
    expect(await group.groupOwner()).to.equal(owner.address);
  });

  it("User can join the group", async function () {
    const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("password"));
    await group.connect(user1).joinGroup(hashedPassword);
  
    expect(await group.checkMembership(user1.address)).to.be.true;
    expect(await group.memberCount()).to.equal(2);
  });
  
  it("User can leave the group", async function () {
    const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("password"));
    await group.connect(user1).joinGroup(hashedPassword);
    await group.connect(user1).leaveGroup();
  
    expect(await group.checkMembership(user1.address)).to.be.false;
    expect(await group.memberCount()).to.equal(1);
  });

  it("Group owner can add a member", async function () {
    await group.connect(owner).addMember(user1.address);
  
    expect(await group.checkMembership(user1.address)).to.be.true;
    expect(await group.memberCount()).to.equal(2);
  });
  
  it("Group owner can remove a member", async function () {
    await group.connect(owner).addMember(user1.address);
    await group.connect(owner).removeMember(user1.address);
  
    expect(await group.checkMembership(user1.address)).to.be.false;
    expect(await group.memberCount()).to.equal(1);
  });
  

  it("User cannot join the group with incorrect password", async function () {
    const wrongHashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("wrong_password"));
  
    await expect(group.connect(user1).joinGroup(wrongHashedPassword)).to.be.revertedWith("Incorrect Password!");
  });
  
  it("User cannot join the group if already a member", async function () {
    const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("password"));
    await group.connect(user1).joinGroup(hashedPassword);
  
    await expect(group.connect(user1).joinGroup(hashedPassword)).to.be.revertedWith("You are already a member of this group!");
  });
  
  it("User cannot leave the group if not a member", async function () {
    await expect(group.connect(user1).leaveGroup()).to.be.revertedWith("You are not a member of this group!");
  });
  
  it("Non-group-owner cannot add a member", async function () {
    await expect(group.connect(user1).addMember(user2.address)).to.be.revertedWith("You must be the group owner to add a member!");
  });
  
  it("Non-group-owner cannot remove a member", async function () {
    const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("password"));
    await group.connect(user1).joinGroup(hashedPassword);
  
    await expect(group.connect(user1).removeMember(user1.address)).to.be.revertedWith("Caller is not the group owner!");
  });

  it("Only the group owner can create a poll", async function () {
    const question = "Test Question";
    const option1 = "Option 1";
    const option2 = "Option 2";
    const duration = 3600;
  
    // Group owner creates a poll successfully
    await group.connect(owner).createPoll(question, option1, option2, duration);
  
    const polls = await group.getPolls();
    expect(polls.length).to.equal(1);
  
    // User1 attempts to create a poll and should fail
    await expect(
      group.connect(user1).createPoll(question, option1, option2, duration)
    ).to.be.revertedWith("Only the group owner can create a poll!");
  });

  it("Group owner can transfer ownership to another member", async function () {
    const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("password"));
    await group.connect(user1).joinGroup(hashedPassword);
  
    await group.connect(owner).transferOwnership(user1.address);
  
    expect(await group.groupOwner()).to.equal(user1.address);
  });

  it("Non-owner cannot transfer ownership", async function () {
    const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("password"));
    await group.connect(user1).joinGroup(hashedPassword);
  
    await expect(group.connect(user1).transferOwnership(user2.address)).to.be.revertedWith("Caller is not the group owner!");
  });

  it("Cannot transfer ownership to a non-member", async function () {
    await expect(group.connect(owner).transferOwnership(user1.address)).to.be.revertedWith("New owner must be a member of the group!");
  });

  it("New owner can create a poll after ownership transfer", async function () {
    const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("password"));
    await group.connect(user1).joinGroup(hashedPassword);
    await group.connect(owner).transferOwnership(user1.address);
  
    const question = "Test Question";
    const option1 = "Option 1";
    const option2 = "Option 2";
    const duration = 3600;
  
    await group.connect(user1).createPoll(question, option1, option2, duration);
  
    const polls = await group.getPolls();
    expect(polls.length).to.equal(1);
  });

  it("New owner can add a member after ownership transfer", async function () {
    const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("password"));
    await group.connect(user1).joinGroup(hashedPassword);
    await group.connect(owner).transferOwnership(user1.address);
  
    await group.connect(user1).addMember(user2.address);
  
    expect(await group.checkMembership(user2.address)).to.be.true;
    expect(await group.memberCount()).to.equal(3);
  });

  it("New owner can remove a member after ownership transfer", async function () {
    const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("password"));
    await group.connect(user1).joinGroup(hashedPassword);
    await group.connect(owner).transferOwnership(user1.address);
    await group.connect(user1).addMember(user2.address);
  
    await group.connect(user1).removeMember(user2.address);
  
    expect(await group.checkMembership(user2.address)).to.be.false;
    expect(await group.memberCount()).to.equal(2);
  });

  it("Previous owner loses owner privileges after ownership transfer", async function () {
    const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("password"));
    await group.connect(user1).joinGroup(hashedPassword);
    await group.connect(owner).transferOwnership(user1.address);
  
    // Previous owner attempts to create a poll and should fail
    const question = "Test Question";
    const option1 = "Option 1";
    const option2 = "Option 2";
    const duration = 3600;
  
    await expect(
      group.connect(owner).createPoll(question, option1, option2, duration)
    ).to.be.revertedWith("Only the group owner can create a poll!");
  
    // Previous owner attempts to add a member and should fail
    await expect(
      group.connect(owner).addMember(user2.address)
    ).to.be.revertedWith("You must be the group owner to add a member!");
  
    // Previous owner attempts to remove a member and should fail
    await expect(
      group.connect(owner).removeMember(user1.address)
    ).to.be.revertedWith("Caller is not the group owner!");
  });

  it("Ownership transfer fails when the new owner is not a member", async function () {
    await expect(
      group.connect(owner).transferOwnership(user1.address)
    ).to.be.revertedWith("New owner must be a member of the group!");
  });

  it("getGroupDetails() returns correct values", async function () {
    const [returnedGroupName, returnedIsGroupPrivate] = await group.getGroupDetails();
    
    expect(returnedGroupName).to.equal("Test Group");
    expect(returnedIsGroupPrivate).to.be.true;
  });

  it("checkPassword() works correctly", async function () {
    const correctHashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("password"));
    const wrongHashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("wrong_password"));
  
    // Call the checkPassword function through the joinGroup function
    await group.connect(user1).joinGroup(correctHashedPassword);
    await expect(group.connect(user2).joinGroup(wrongHashedPassword)).to.be.revertedWith("Incorrect Password!");
  
    // Check if the user1 has joined the group, and user2 has not
    expect(await group.checkMembership(user1.address)).to.be.true;
    expect(await group.checkMembership(user2.address)).to.be.false;
  });

  // helper function that increases time
  async function increaseTime(seconds) {
    await ethers.provider.send("evm_increaseTime", [seconds]);
    await ethers.provider.send("evm_mine");
  }

  it("Cannot create a new poll while there's an active poll", async function () {
    const question = "Test Question";
    const option1 = "Option 1";
    const option2 = "Option 2";
    const duration = 3600;
  
    // Group owner creates a poll successfully
    await group.connect(owner).createPoll(question, option1, option2, duration);
  
    // Group owner attempts to create another poll and should fail
    await expect(
      group.connect(owner).createPoll(question, option1, option2, duration)
    ).to.be.revertedWith("There is already an active poll!");
  });

  it("Group owner can create a poll while there is no active poll", async function () {
    const question = "Test Question";
    const option1 = "Option 1";
    const option2 = "Option 2";
    const duration = 3600;
  
    await group.connect(owner).createPoll(question, option1, option2, duration);
  
    const polls = await group.getPolls();
    expect(polls.length).to.equal(1);
  });

  it("User can vote in a poll", async function () {
    const question = "Test Question";
    const option1 = "Option 1";
    const option2 = "Option 2";
    const duration = 3600;
  
    await group.connect(owner).createPoll(question, option1, option2, duration);
  
    const polls = await group.getPolls();
    const poll = await Poll.attach(polls[0]);
  
    await poll.connect(user1).vote(1); // user1 votes for option 1

    const [userVote, hasVoted] = await poll.getUserVote(user1.address);
    expect(userVote).to.equal(1);
  });


  it("User can't vote more than once in the same poll", async function () {
    const question = "Test Question";
    const option1 = "Option 1";
    const option2 = "Option 2";
    const duration = 3600;
  
    await group.connect(owner).createPoll(question, option1, option2, duration);
    await group.connect(owner).addMember(user1.address);
  
    const polls = await group.getPolls();
    const poll = await Poll.attach(polls[0]);
  
    await poll.connect(user1).vote(1); // user1 votes for option 1

    await expect(poll.connect(user1).vote(2)).to.be.revertedWith("You have already voted!");
  });

});
