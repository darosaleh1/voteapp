// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Poll.sol";
import "./GroupFactory.sol";


contract Group {
    string public groupName;
    uint256 public memberCount;
    bool public isGroupPrivate;
    bytes32 private hashedPassword;
    mapping(address => bool) public members;
    address[] public polls;
    address public groupOwner;
    address public groupFactoryAddress;
    address public activePoll;


    event PollCreated(address indexed pollAddress, address indexed owner);


    constructor(string memory _groupName,bool _isGroupPrivate,bytes32 _hashedPassword,address _groupFactoryAddress,address _groupOwner) {
        groupName = _groupName;
        isGroupPrivate = _isGroupPrivate;
        groupFactoryAddress = _groupFactoryAddress;
        groupOwner = _groupOwner;
        members[groupOwner] = true;
        memberCount++;

        if (isGroupPrivate) {
            require(_hashedPassword != bytes32(0), "Private Group must have a password!");
            hashedPassword = _hashedPassword;
        }
    }


    function checkMembership(address _address) public view returns (bool) {
        return members[_address];
    }


    function joinGroup(bytes32 _hashedPassword) public {
        if (isGroupPrivate) {
            require(checkPassword(_hashedPassword), "Incorrect Password!");
        }
        require(!members[msg.sender], "You are already a member of this group!");
        members[msg.sender] = true;
        GroupFactory(groupFactoryAddress).updateUserGroups(msg.sender, address(this), true);
        memberCount++;
    }


    function leaveGroup() public {
        require(members[msg.sender], "You are not a member of this group!");
        members[msg.sender] = false;
        GroupFactory(groupFactoryAddress).updateUserGroups(msg.sender, address(this), false);
        memberCount--;

    }

    function addMember(address _newMember) public {
    require(msg.sender == groupOwner, "You must be the group owner to add a member!");
    require(!members[_newMember], "This person is already a member of the group!");
    members[_newMember] = true;
    GroupFactory(groupFactoryAddress).updateUserGroups(_newMember, address(this), true);
    memberCount++;
    }

    

    function removeMember(address _memberAddress) public {
    require(msg.sender == groupOwner, "Caller is not the group owner!");
    require(members[_memberAddress], "This person doesn't belong to the group!");
    members[_memberAddress] = false;
    GroupFactory(groupFactoryAddress).updateUserGroups(_memberAddress, address(this), false);
    memberCount--;
    }

    function getGroupDetails() public view returns (string memory, bool) {
    return (groupName, isGroupPrivate);
    }


    function checkPassword(bytes32 _hashedPassword) private view returns (bool) {
        return _hashedPassword == hashedPassword; 
    }

    function transferOwnership(address _newOwner) public {
        require(msg.sender == groupOwner, "Caller is not the group owner!");
        require(members[_newOwner], "New owner must be a member of the group!");

        groupOwner = _newOwner;
    }


    function createPoll(string memory _question, string memory _option1, string memory _option2, uint256 _duration) public {
    require(msg.sender == groupOwner, "Only the group owner can create a poll!");
    require(members[msg.sender], "You must be a member of this group to create a poll!");
    if (activePoll != address(0)) {
        bool hasEnded = Poll(activePoll).hasEnded();
        require(hasEnded, "There is already an active poll!");
    }

    Poll newPoll = new Poll(msg.sender, _question, _option1, _option2, _duration);
    polls.push(address(newPoll));
    activePoll = address(newPoll);

    emit PollCreated(address(newPoll), msg.sender);
    }



    function getPolls() public view returns (address[] memory) {
        return polls;
    }

}