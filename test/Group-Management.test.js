// test/group-management.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Group Management", function () {
  let GroupFactory, groupFactory, Group, group, groupAddress, owner, member1, member2, nonMember;

  before(async function () {
    [owner, member1, member2, nonMember] = await ethers.getSigners();

    GroupFactory = await ethers.getContractFactory("GroupFactory");
    groupFactory = await GroupFactory.deploy();
    await groupFactory.deployed();

    Group = await ethers.getContractFactory("Group");
  });

  describe("Group Creation", function () {
    it("Should create a public group", async function () {
      await groupFactory.createGroup("Public Group", false, ethers.constants.HashZero);
      groupAddress = await groupFactory.getGroup(owner.address, 0);
      group = await Group.attach(groupAddress);

      expect(await group.name()).to.equal("Public Group");
      expect(await group.isPublic()).to.equal(true);
      expect(await group.owner()).to.equal(owner.address);
    });

    it("Should create a private group with a hashed password", async function () {
      const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("password"));
      await groupFactory.createGroup("Private Group", true, hashedPassword);
      groupAddress = await groupFactory.getGroup(owner.address, 1);
      group = await Group.attach(groupAddress);

      expect(await group.name()).to.equal("Private Group");
      expect(await group.isPublic()).to.equal(false);
      expect(await group.hashedPassword()).to.equal(hashedPassword);
      expect(await group.owner()).to.equal(owner.address);
    });
  });

  describe("Group Membership", function () {
    let publicGroup;

    before(async function () {
      groupAddress = await groupFactory.getGroup(owner.address, 0);
      publicGroup = await Group.attach(groupAddress);
    });

    it("Should allow users to join a public group", async function () {
      await publicGroup.connect(member1).join();
      expect(await publicGroup.isMember(member1.address)).to.equal(true);
    });

    it("Should not allow users to join a private group with a wrong password", async function () {
      const wrongPassword = ethers.utils.toUtf8Bytes("wrong_password");
      await expect(group.connect(member1).joinPrivate(wrongPassword)).to.be.revertedWith("Incorrect password!");
    });

    it("Should allow users to join a private group with the correct password", async function () {
      const password = ethers.utils.toUtf8Bytes("password");
      await group.connect(member1).joinPrivate(password);
      expect(await group.isMember(member1.address)).to.equal(true);
    });

    it("Should allow the owner to add a member", async function () {
      await group.addMember(member2.address);
      expect(await group.isMember(member2.address)).to.equal(true);
    });

    it("Should not allow non-members to leave the group", async function () {
      await expect(group.connect(nonMember).leave()).to.be.revertedWith("You are not a member!");
    });

    it("Should allow members to leave the group", async function () {
      await group.connect(member1).leave();
      expect(await group.isMember(member1.address)).to.equal(false);
    });

    it("Should allow the owner to remove a member", async function () {
      await group.removeMember(member2.address);
      expect(await group.isMember(member2.address)).to.equal(false);
    });
  });
});
