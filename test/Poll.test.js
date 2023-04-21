const { expect } = require("chai");
const { ethers } = require("hardhat");
const { increaseTime } = require("./utils");



describe("Poll Contract", () => {
  let Poll, poll, Group, group, GroupFactory, groupFactory, owner, user1, user2, user3, isGroupPrivate;
  const question = "Which color do you prefer?";
  const option1 = "Blue";
  const option2 = "Red";
  const duration = 86400;

  beforeEach(async () => {
    [owner, user1, user2, user3] = await ethers.getSigners();
    isGroupPrivate = false;
    const hashedPassword = ethers.utils.formatBytes32String("");

    GroupFactory = await ethers.getContractFactory("GroupFactory");
    groupFactory = await GroupFactory.deploy();

    Group = await ethers.getContractFactory("Group");

    await groupFactory.connect(owner).createGroup("Test Group", isGroupPrivate, hashedPassword)

    const groupAddress = (await groupFactory.getDeployedGroups())[0];
    group = await Group.attach(groupAddress);

    Poll = await ethers.getContractFactory("Poll");
    poll = await Poll.deploy(owner.address, question, option1, option2, duration, group.address);

    

    await group.connect(user1).joinGroup(ethers.utils.formatBytes32String(""));
    await group.connect(user2).joinGroup(ethers.utils.formatBytes32String(""));
  });

  describe("Voting ", () => {
    it("Should allow a group member to vote", async () => {
      await poll.connect(user1).vote(0);
      expect(await poll.getVoteCount(0)).to.equal(1);
    });

    it("Should not allow a non-member to vote", async () => {
      await expect(poll.connect(user3).vote(0)).to.be.revertedWith("Caller is not a group member!");
    });
  });

  describe("End poll", () => {
    it("Should not allow voting after the poll has ended", async () => {
      await poll.connect(user1).vote(0);
      await increaseTime(duration + 1);
      await poll.endPoll();
      await expect(poll.connect(user2).vote(0)).to.be.revertedWith("The poll has reached its end time!");
    });

    it("Should not allow ending the poll before its reached its duration", async () => {
      await expect(poll.endPoll()).to.be.revertedWith("The poll has not yet reached its end time!");
    });

    it("Should not allow ending the poll twice", async () => {
      await increaseTime(duration + 1);
      await poll.endPoll();
      await expect(poll.endPoll()).to.be.revertedWith("The poll has already been ended!");
    });
  });





  describe("Get winner and claim NFT", () => {
    it("Should return the winner after the poll has ended", async () => {
      await poll.connect(user1).vote(0);
      await increaseTime(duration + 1);
      await poll.endPoll();
      expect(await poll.getWinner()).to.equal(option1);
    });

    it("Should return 'tie' if there is a tie", async () => {
        await poll.connect(user1).vote(0);
        await poll.connect(user2).vote(1);
        await increaseTime(duration + 1);
        await poll.endPoll();
        expect(await poll.getWinner()).to.equal("tie");
    });

    it("Should not return the winner before the poll has ended", async () => {
      await poll.connect(user1).vote(0);
      await expect(poll.getWinner()).to.be.revertedWith("The poll has not ended yet!");
    });

    it("Should allow users to claim NFT after voting", async () => {
        await poll.connect(user1).vote(0);
        await poll.connect(user1).claimNFT();
        const userVote = await poll.getUserVote(user1.address);
        expect(userVote.optionIndex.toNumber()).to.equal(0);
        expect(userVote.hasVoted).to.be.true;
        expect(userVote.hasClaimedNFT).to.be.true;
      });
      
      
      

    it("Should not allow users to claim NFT before voting", async () => {
        await expect(poll.connect(user1).claimNFT()).to.be.revertedWith("You must vote before claiming an NFT!");
      });
  
      it("Should not allow users to claim NFT twice", async () => {
        await poll.connect(user1).vote(0);
        await poll.connect(user1).claimNFT();
        await expect(poll.connect(user1).claimNFT()).to.be.revertedWith("You have already claimed your NFT!");
      });
    });
  
    describe("Get vote details", () => {
        it("Should return the vote details for a specific option", async () => {
            await poll.connect(user1).vote(0);
            const voteDetails = await poll.getVoteDetails(0, 0, 1);
            expect(voteDetails[0].voter).to.equal(user1.address);
            expect(voteDetails[0].blockNumber.toNumber()).to.be.a("number");
            expect(voteDetails[0].blockTimestamp.toNumber()).to.be.a("number");
            expect(voteDetails[0].transactionId).to.equal('0x0000000000000000000000000000000000000000000000000000000000000000');
        });
        
  
      it("Should return an empty array if the start index is greater than or equal to the vote details length", async () => {
        await poll.connect(user1).vote(0);
        const voteDetails = await poll.getVoteDetails(0, 1, 1);
        expect(voteDetails).to.deep.equal([]);
      });
  
      it("Should return a slice of vote details if the start index and count are valid", async () => {
        await poll.connect(user1).vote(0);
        await poll.connect(user2).vote(0);
        const voteDetails = await poll.getVoteDetails(0, 0, 1);
        expect(voteDetails).to.have.lengthOf(1);
        expect(voteDetails[0].voter).to.equal(user1.address);
      });
    });
  
    describe("Update transaction ID", () => {
      it("Should update the transaction ID for a voter", async () => {
        await poll.connect(user1).vote(0);
        const txId = ethers.utils.keccak256("0x1234");
        await poll.connect(user1).updateTransactionId(txId);
        const voteDetails = await poll.getVoteDetails(0, 0, 1);
        expect(voteDetails[0].transactionId).to.equal(txId);
      });
  
      it("Should not allow updating the transaction ID for a non-voter", async () => {
        const txId = ethers.utils.keccak256("0x1234");
        await expect(poll.connect(user1).updateTransactionId(txId)).to.be.revertedWith("You have not voted yet!");
      });
    });
  });
  