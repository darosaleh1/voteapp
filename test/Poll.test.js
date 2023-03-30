const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Poll Contract", function () {
    let Poll;
    let poll;
    let owner;
    let addr1;
    let addr2;
    let addrs;
  
    beforeEach(async function () {
        Poll = await ethers.getContractFactory("Poll");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
  
        poll = await Poll.deploy(owner.address, "Test Poll", "Option 1", "Option 2", 86400);
        await poll.deployed();
    });

    it("Should set the correct poll question and options", async function () {
        const pollData = await poll.pollData();
        expect(pollData.question).to.equal("Test Poll");
        expect(await poll.getOption(0)).to.equal("Option 1");
        expect(await poll.getOption(1)).to.equal("Option 2");
    });

    it("Should allow a user to vote and correctly count the vote", async function () {
        // addr1 votes for option 0
        await poll.connect(addr1).vote(0);
    
        // Check if the vote was counted correctly
        const voteCount = await poll.getVoteCount(0);
        expect(voteCount).to.equal(1);
    
        // Check if the user's vote was recorded correctly
        const [userVoteOptionIndex, userHasVoted] = await poll.getUserVote(addr1.address);
        expect(userVoteOptionIndex).to.equal(0);
        expect(userHasVoted).to.equal(true);
    });

    it("Should not allow a user to vote after the poll has ended", async function () {
        // Fast forward time to after the poll has ended
        const currentTime = await ethers.provider.getBlock("latest").then((block) => block.timestamp);
        const endTime = (await poll.pollData()).endTime;
        const timeToTravel = endTime - currentTime + 1;
        await ethers.provider.send("evm_increaseTime", [timeToTravel]);
        await ethers.provider.send("evm_mine");
    
        // addr1 tries to vote for option 0
        await expect(poll.connect(addr1).vote(0)).to.be.revertedWith("The poll has already ended.");
    });

    it("Should not allow a user to vote twice", async function () {
        // addr1 votes for option 0
        await poll.connect(addr1).vote(0);
    
        // addr1 tries to vote again
        await expect(poll.connect(addr1).vote(0)).to.be.revertedWith("You have already voted.");
    });

    it("Should not allow a user to vote with an invalid option index", async function () {
        // addr1 tries to vote with an invalid option index
        await expect(poll.connect(addr1).vote(10)).to.be.revertedWith("Invalid option index.");
    });

    it("Should return the correct option for a given index", async function () {
        expect(await poll.getOption(0)).to.equal("Option 1");
        expect(await poll.getOption(1)).to.equal("Option 2");
    });
    it("Should set the poll creator's address correctly", async function () {
        const pollData = await poll.pollData();
        expect(pollData.creator).to.equal(owner.address);
    });

    
});
