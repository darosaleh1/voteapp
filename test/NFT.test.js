const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotedNFT Contract", () => {
    let VotedNFT, votedNFT, owner, user1, user2;

    beforeEach(async () => {
        [owner, user1, user2] = await ethers.getSigners();

        VotedNFT = await ethers.getContractFactory("VotedNFT");
        votedNFT = await VotedNFT.deploy();
    });

    it("Should mint an NFT", async () => {
        const pollName = "Which color do you prefer?";
        const voterNumber = 1;
        const voteTimestamp = Math.floor(Date.now()/1000);
    
        await votedNFT.connect(owner).mint(user1.address, pollName, voterNumber, voteTimestamp);
        expect(await votedNFT.ownerOf(0)).to.equal(user1.address);
    });

    it("Should not allow non-owners to mint an NFT", async () => {
        const pollName = "Which color do you prefer?";
        const voterNumber = 1;
        const voteTimestamp = Math.floor(Date.now()/1000);
    
        await expect(votedNFT.connect(user1).mint(user1.address, pollName, voterNumber, voteTimestamp)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should retrieve token metadata", async () => {
        const pollName = "Which color do you prefer?";
        const voterNumber = 1;
        const voteTimestamp = Math.floor(Date.now()/1000);
    
        await votedNFT.connect(owner).mint(user1.address, pollName, voterNumber, voteTimestamp);
        const metadata = await votedNFT.tokenMetadata(0);
    
        expect(metadata.pollName).to.equal(pollName);
        expect(metadata.voterNumber).to.equal(voterNumber);
        expect(metadata.voteTimestamp).to.equal(voteTimestamp);
    });

    
    
    
    
});
