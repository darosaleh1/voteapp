const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Group Contract", function () {
    let Group;
    let group;
    let owner;
    let addr1;
    let addr2;
    let addrs;
  
    beforeEach(async function () {
        Group = await ethers.getContractFactory("Group");
        Poll = await ethers.getContractFactory("Poll");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    
        // Deploy a public group
        group = await Group.deploy("Test Group", false, "0x0000000000000000000000000000000000000000000000000000000000000000");
        await group.deployed();
    });

    it("Should return the correct group name", async function () {
        expect(await group.groupName()).to.equal("Test Group");
    });

    it("Should add the group creator as a member", async function () {
        const isCreatorMember = await group.checkMembership(owner.address);
        expect(isCreatorMember).to.be.true;
    });

    it("Should allow a user to join a public group", async function () {
        await group.connect(addr1).joinGroup("0x0000000000000000000000000000000000000000000000000000000000000000");
    
        // Check if addr1 is a member of the group
        const isAddr1Member = await group.checkMembership(addr1.address);
        expect(isAddr1Member).to.be.true;
    });

    it("Should allow a user to leave the group", async function () {
        await group.connect(addr1).joinGroup("0x0000000000000000000000000000000000000000000000000000000000000000");

        await group.connect(addr1).leaveGroup()

        const isAddr1Member = await group.checkMembership(addr1.address);
        expect(isAddr1Member).to.be.false;
    })
      
    it("Should return the correct group details", async function () {
        const [returnedGroupName, isGroupPrivate] = await group.getGroupDetails();
        expect(returnedGroupName).to.equal("Test Group");
        expect(isGroupPrivate).to.be.false;
    });
    
    it("Should allow the group creator to remove a member", async function () {
        // addr1 joins the group
        await group.connect(addr1).joinGroup("0x0000000000000000000000000000000000000000000000000000000000000000");
    
        // Owner removes addr1 from the group
        await group.removeMember(addr1.address);
    
        // Check if addr1 is still a member of the group
        const isAddr1Member = await group.checkMembership(addr1.address);
        expect(isAddr1Member).to.be.false;
    });

    it("Should allow a group member to create a poll", async function () {
        const pollQuestion = "Which color do you prefer?";
        const pollOption1 = "Red";
        const pollOption2 = "Blue";
        const pollDuration = 60 * 60; // 1 hour
    
        // Create a poll as the group owner
        await group.createPoll(pollQuestion, pollOption1, pollOption2, pollDuration);
    
        // Get the polls
        const polls = await group.getPolls();
    
        // Check if there's one poll and the creator is the owner
        expect(polls.length).to.equal(1);
    
        const Poll = await ethers.getContractFactory("Poll");
        const poll = Poll.attach(polls[0]);
    
        // Check if the poll data is correct
        const pollData = await poll.pollData();
        expect(pollData.question).to.equal(pollQuestion);
        const option1 = await poll.getOption(0);
        const option2 = await poll.getOption(1);
        expect(option1).to.equal(pollOption1);
        expect(option2).to.equal(pollOption2);
        expect(pollData.creator).to.equal(owner.address);
    });

    it("Should return the correct poll addresses", async function () {
        // Add addr1 to the group
        await group.connect(owner).addMember(addr1.address);
      
        // Create a poll
        await group.connect(addr1).createPoll("Test Poll 1", "Option 1", "Option 2", 1000);
      
        // Get poll addresses
        const pollAddresses = await group.getPolls();
      
        // Check if the poll address matches the one returned by the getPolls function
        expect(pollAddresses.length).to.equal(1);
        const createdPoll = await Poll.attach(pollAddresses[0]);
        const pollData = await createdPoll.pollData();
        expect(pollData.question).to.equal("Test Poll 1");
      });

      it("Should not allow a non-member to create a poll", async function () {
        await expect(
          group.connect(addr1).createPoll("Test Poll 1", "Option 1", "Option 2", 1000)
        ).to.be.revertedWith("You must be a member of this group to create a poll.");
      });
      
      it("Should allow the group creator to add a member", async function () {
        // Owner adds addr1 to the group
        await group.addMember(addr1.address);

        // Check if addr1 is a member of the group
        const isAddr1Member = await group.checkMembership(addr1.address);
        expect(isAddr1Member).to.be.true;
    });

    it("Should not allow a non-group creator to add a member", async function () {
      await expect(
          group.connect(addr1).addMember(addr2.address)
      ).to.be.revertedWith("You must be the group creator to add a member.");
    });

    it("Should allow the group creator to remove a member", async function () {
      // addr1 joins the group
      await group.connect(addr1).joinGroup("0x0000000000000000000000000000000000000000000000000000000000000000");

      // Owner removes addr1 from the group
      await group.removeMember(addr1.address);

      // Check if addr1 is still a member of the group
      const isAddr1Member = await group.checkMembership(addr1.address);
      expect(isAddr1Member).to.be.false;
  });

  it("Should not allow a non-group creator to remove a member", async function () {
    // addr1 joins the group
    await group.connect(addr1).joinGroup("0x0000000000000000000000000000000000000000000000000000000000000000");

    await expect(
        group.connect(addr1).removeMember(addr1.address)
    ).to.be.revertedWith("Caller is not the group creator");
});


      
      
      
      
      
      
    
    
    
    
    
    
    

});

      