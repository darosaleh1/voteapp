const { expect } = require("chai");
const { ethers } = require("hardhat");
const { increaseTime } = require("./utils");


describe("GroupManagement", () => {
  let Group, GroupFactory, Poll, group, groupFactory;
  let owner, user1, user2, user3;
  const isGroupPrivate = false;

  beforeEach(async () => {
    [owner, user1, user2, user3] = await ethers.getSigners();
    GroupFactory = await ethers.getContractFactory("GroupFactory");
    Group = await ethers.getContractFactory("Group");
    Poll = await ethers.getContractFactory("Poll");

    groupFactory = await GroupFactory.deploy();
    await groupFactory.deployed();

    const hashedPassword = ethers.utils.formatBytes32String("");
    await groupFactory.connect(owner).createGroup("Test Group", isGroupPrivate, hashedPassword)

    const groupAddress = (await groupFactory.getDeployedGroups())[0];
    group = await Group.attach(groupAddress);

  });

  describe("Group Creation", () => {
    it("Should create a public group", async () => {
      expect(await group.groupName()).to.equal("Test Group");
      expect(await group.isGroupPrivate()).to.equal(isGroupPrivate);
      expect(await group.groupOwner()).to.equal(owner.address);
    });
  });

  describe("Group Creation without a password for a private group", () => {
    it("Should fail to create a private group without a hashed password", async () => {
      const hashedPassword = ethers.utils.formatBytes32String("");
  
      await expect(
        groupFactory.connect(owner).createGroup("Private Group", true, hashedPassword)
      ).to.be.revertedWith("Private Group must have a password!");
    });
  });
  

  

  describe("Private Group Creation and Access", () => {
    it("Should create a private group with a hashed password", async () => {
      const hashedPassword = ethers.utils.formatBytes32String("password");
      await groupFactory.connect(owner).createGroup("Private Group", true, hashedPassword);
  
      const groupAddress = (await groupFactory.getDeployedGroups())[1];
      const privateGroup = await Group.attach(groupAddress);
  
      expect(await privateGroup.isGroupPrivate()).to.equal(true);
    });
  
    it("Should not allow a user to join a private group with an incorrect password", async () => {
      const hashedPassword = ethers.utils.formatBytes32String("password");
      await groupFactory.connect(owner).createGroup("Private Group", true, hashedPassword);
  
      const groupAddress = (await groupFactory.getDeployedGroups())[1];
      const privateGroup = await Group.attach(groupAddress);
  
      const incorrectHashedPassword = ethers.utils.formatBytes32String("wrong_password");
  
      await expect(
        privateGroup.connect(user1).joinGroup(incorrectHashedPassword)
      ).to.be.revertedWith("Incorrect Password!");
    });
  });
  

  describe("Join and Leave Group", () => {
    it("Should allow a user to join the group", async () => {
      await group.connect(user1).joinGroup(ethers.utils.formatBytes32String(""));
      expect(await group.isMember(user1.address)).to.equal(true);
    });

    it("Should allow a user to leave the group", async () => {
      await group.connect(user1).joinGroup(ethers.utils.formatBytes32String(""));
      await group.connect(user1).leaveGroup();
      expect(await group.isMember(user1.address)).to.equal(false);
    });

    it("Should allow the group owner to remove a member", async () => {
      await group.connect(user1).joinGroup(ethers.utils.formatBytes32String(""));
      await group.removeMember(user1.address);
      expect(await group.members(user1.address)).to.equal(false);
      expect(await group.memberCount()).to.equal(1);
    });
  });

  describe("Ownership", () => {
    it("Should transfer ownership to another member", async () => {
      await group.connect(user1).joinGroup(ethers.utils.formatBytes32String(""));
      await group.transferOwnership(user1.address);
      expect(await group.groupOwner()).to.equal(user1.address);
    });
  });

  describe("Poll Creation and Management", () => {
    it("should create a poll by the group owner", async () => {
      const question = "Which color do you prefer?";
      const option1 = "Blue";
      const option2 = "Red";
      const duration = 600;

      await group.connect(owner).createPoll(question, option1, option2, duration);
      const activePoll = await group.getActivePoll();
      expect(activePoll).not.to.equal("0x0000000000000000000000000000000000000000");
    });

    it("should not allow non-owner to create a poll", async () => {
      const question = "Which color do you prefer?";
      const option1 = "Blue";
      const option2 = "Red";
      const duration = 600;
    
      await expect(
        group.connect(user1).createPoll(question, option1, option2, duration)
      ).to.be.revertedWith("Caller is not the group owner!");
    });
    
    
    it("should clear an active poll after it has ended", async () => {
      const question = "Which color do you prefer?";
      const option1 = "Blue";
      const option2 = "Red";
      const duration = 1; // Set the duration to 1 second for the test
    
      await group.connect(owner).createPoll(question, option1, option2, duration);
      const activePollAddress = await group.getActivePoll();
      const activePoll = await Poll.attach(activePollAddress);
    
      await increaseTime(1000); // Wait for the poll to end
      await activePoll.endPoll();
      await group.clearActivePoll();
    
      const newActivePoll = await group.getActivePoll();
      expect(newActivePoll).to.equal("0x0000000000000000000000000000000000000000");
    });
    
    it("should not allow to clear an active poll before it has ended", async () => {
      const question = "Which color do you prefer?";
      const option1 = "Blue";
      const option2 = "Red";
      const duration = 600;
    
      await group.connect(owner).createPoll(question, option1, option2, duration);
    
      await expect(group.clearActivePoll()).to.be.revertedWith("Poll is still active");
    });
    

    it("Should get active and past polls", async () => {
      const question = "What color do you prefer?";
      const option1 = "Red";
      const option2 = "Blue";
      const duration = 3600;

      await group.connect(owner).createPoll(question, option1, option2, duration);

      await increaseTime(duration + 1);

      const activePoll = await group.getActivePoll();

      const activePollInstance = await Poll.attach(activePoll);

      await activePollInstance.endPoll();

      const hasEnded = await activePollInstance.hasEnded();
      expect(hasEnded).to.equal(true);

      await group.connect(owner).createPoll(question, option1, option2, duration);

      const [pastPolls, lastPoll] = await group.getPastPolls();

      expect(pastPolls.length).to.equal(1);
      expect(pastPolls[0]).to.equal(activePoll);
    });

  });

  describe("Get Past Polls with No Polls", () => {
    it("Should return an empty array and an empty address when no polls have been created", async () => {
      const [pastPolls, lastPoll] = await group.getPastPolls();
  
      expect(pastPolls.length).to.equal(0);
      expect(pastPolls).to.deep.equal([]);
      expect(lastPoll).to.equal("0x0000000000000000000000000000000000000000");
    });
  });

  describe("Get Group Members", () => {
    it("Should return an array of member addresses", async () => {
      // Group owner is a member by default
      expect(await group.getMembers()).to.deep.equal([owner.address]);
  
      // Join two more users to the group
      await group.connect(user1).joinGroup(ethers.utils.formatBytes32String(""));
      await group.connect(user2).joinGroup(ethers.utils.formatBytes32String(""));
  
      // Check if the function returns the correct member addresses
      expect(await group.getMembers()).to.deep.equal([owner.address, user1.address, user2.address]);
    });
  });

  describe("Get User Groups", () => {
    it("Should return an array of groups the user is a member of", async () => {
      expect(await groupFactory.getUserGroups(user1.address)).to.deep.equal([]);
  
      await group.connect(user1).joinGroup(ethers.utils.formatBytes32String(""));
  
      expect(await groupFactory.getUserGroups(user1.address)).to.deep.equal([group.address]);
  
      const hashedPassword = ethers.utils.formatBytes32String("");
      await groupFactory.connect(owner).createGroup("Test Group 2", isGroupPrivate, hashedPassword);
      const groupAddress2 = (await groupFactory.getDeployedGroups())[1];
      const group2 = await Group.attach(groupAddress2);
      await group2.connect(user1).joinGroup(ethers.utils.formatBytes32String(""));
  
      expect(await groupFactory.getUserGroups(user1.address)).to.deep.equal([group.address, group2.address]);
    });
  });
  
  
  

});

     
