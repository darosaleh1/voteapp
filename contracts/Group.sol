// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Poll.sol";


contract Group {
    string public groupName;
    uint256 public memberCount;
    bool public isGroupPrivate;
    bytes32 private hashedPassword;
    mapping(address => bool) public members;
    address[] public polls;




    constructor(string memory _groupName, bool _isGroupPrivate, bytes32 _hashedPassword) {
    groupName = _groupName;
    isGroupPrivate = _isGroupPrivate;

    // Add the group creator as a member
    address groupCreator = msg.sender;
    members[groupCreator] = true;
    memberCount++;

    if (isGroupPrivate){
        require(_hashedPassword != bytes32(0), "Private Group must have a non-empty password");
        hashedPassword = _hashedPassword;
        }
    }

    function checkMembership(address _address) public view returns (bool) {
        return members[_address];
    }


    function joinGroup(bytes32 _hashedPassword) public {
        require(checkPassword(_hashedPassword), "Incorrect Password!");
        require(!members[msg.sender], "You are already a member of this group!");
        members[msg.sender] = true;
        memberCount++;
    }

    function leaveGroup() public {
        require(members[msg.sender], "You are not a member of this group!");
        members[msg.sender] = false;
        memberCount--;

    }

    function addMember(address _newMember) public {
    require(members[msg.sender], "You must be a member of this group to add a member.");
    require(!members[_newMember], "This person is already a member of the group!");
    members[_newMember] = true;
    memberCount++;
    }

    function getGroupDetails() public view returns (string memory, bool) {
    return (groupName, isGroupPrivate);
    }

    function removeMember(address _memberAddress) public {
    require(members[msg.sender], "Caller is not a member");
    require(members[_memberAddress], "This person doesn't belong to the group!");
    members[_memberAddress] = false;
    memberCount--;
}


    function checkPassword(bytes32 _hashedPassword) private view returns (bool) {
        return _hashedPassword == hashedPassword; 
    }

    function createPoll(string memory _question, string memory _option1, string memory _option2, uint256 _duration) public {
        require(members[msg.sender], "You must be a member of this group to create a poll.");

        Poll newPoll = new Poll(msg.sender, _question, _option1, _option2, _duration);
        polls.push(address(newPoll));
    }

    function getPolls() public view returns (address[] memory) {
        return polls;
    }



}