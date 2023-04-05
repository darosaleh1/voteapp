const { expect } = require("chai");
const { ethers } = require("hardhat");
const { network } = require("hardhat");


describe("Poll", function () {
  let Poll, poll, pollCreator, voter1, voter2, voter3;
  

  beforeEach(async () => {
    Poll = await ethers.getContractFactory("Poll");
    [pollCreator, voter1, voter2, voter3] = await ethers.getSigners();
    

    poll = await Poll.deploy(pollCreator.address, "Which is your favorite fruit?", "Apple", "Banana", 3600 * 24);
    await poll.deployed();
  });

  it("should deploy the contract with the correct data", async function () {
    expect(await poll.getOption(0)).to.equal("Apple");
    expect(await poll.getOption(1)).to.equal("Banana");
    const pollData = await poll.pollData();
    expect(pollData.creator).to.equal(pollCreator.address);
    expect(pollData.duration).to.equal(60 * 60 * 24);
  });

  it("should allow a user to vote", async function () {
    await poll.connect(voter1).vote(0);
    const [optionIndex, hasVoted] = await poll.getUserVote(voter1.address);
    expect(hasVoted).to.be.true;
    expect(await poll.getVoteCount(0)).to.equal(1);
});



  it("should not allow a user to vote twice", async function () {
    await poll.connect(voter1).vote(0);

    await expect(poll.connect(voter1).vote(1)).to.be.revertedWith("You have already voted!");
  });

  it("should not allow a user to vote after the poll has ended", async function () {
    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24]);
    await ethers.provider.send("evm_mine");

    await expect(poll.connect(voter1).vote(0)).to.be.revertedWith("The poll has already ended!");
  });

  it("should determine the winner correctly", async function () {
    await poll.connect(voter1).vote(0);
    await poll.connect(voter2).vote(1);
    await poll.connect(voter3).vote(0);

    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24]);
    await ethers.provider.send("evm_mine");

    await poll.endPoll();

    expect(await poll.getWinner()).to.equal("Apple");
  });

  it("should return 'tie' if there is a tie", async function () {
    await poll.connect(voter1).vote(0);
    await poll.connect(voter2).vote(1);

    await ethers.provider.send("evm_increaseTime", [60 * 60 * 24]);
    await ethers.provider.send("evm_mine");

    await poll.endPoll();

    expect(await poll.getWinner()).to.equal("tie");
  });

  it("should not be ended before its end time", async function () {
    expect(await poll.hasEnded()).to.be.false;
});

  it("should only allow the poll creator to end the poll", async function () {
      await expect(poll.connect(voter1).endPoll()).to.be.revertedWith("Only the poll creator can end the poll!");
  });

  it("should not allow a user to vote after the poll has ended", async function () {
    await network.provider.send("evm_increaseTime", [60 * 60 * 24]);
    await network.provider.send("evm_mine");
    await poll.endPoll();
    await expect(poll.connect(voter1).vote(0)).to.be.revertedWith("The poll has ended!");
});


  it("should not allow a user to vote twice", async function () {
      await poll.connect(voter1).vote(0);
      await expect(poll.connect(voter1).vote(0)).to.be.revertedWith("You have already voted!");
  });

    it("should return the correct winner", async function () {
      await poll.connect(voter1).vote(0);
      await poll.connect(voter2).vote(0);
      await poll.connect(voter3).vote(1);
      await network.provider.send("evm_increaseTime", [60 * 60 * 24]);
      await network.provider.send("evm_mine");
      await poll.endPoll();
      expect(await poll.getWinner()).to.equal("Apple");
  });

    it("should return 'tie' when there is a tie", async function () {
      await poll.connect(voter1).vote(0);
      await poll.connect(voter2).vote(1);
      await network.provider.send("evm_increaseTime", [60 * 60 * 24]);
      await network.provider.send("evm_mine");
      await poll.endPoll();
      expect(await poll.getWinner()).to.equal("tie");
  });

  it("should not allow a user to vote for an invalid option", async function () {
    await expect(poll.connect(voter1).vote(2)).to.be.revertedWith("Invalid option!");
  });

  it("should not allow the poll creator to end the poll before its end time", async function () {
    await expect(poll.connect(pollCreator).endPoll()).to.be.revertedWith("The poll has not yet reached its end time!");
});



  it("should not allow anyone other than the poll creator to end the poll", async function () {
    await network.provider.send("evm_increaseTime", [60 * 60 * 24]);
    await network.provider.send("evm_mine");
    await expect(poll.connect(voter1).endPoll()).to.be.revertedWith("Only the poll creator can end the poll!");
});




});
