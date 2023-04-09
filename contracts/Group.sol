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
    



    modifier onlyGroupOwner() {
        require(msg.sender == groupOwner, "Caller is not the group owner!");
        _;
    }


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

    function clearActivePoll() public {
        require(activePoll != address(0), "No active poll");
        require(Poll(activePoll).hasEnded(), "Poll is still active");
        activePoll = address(0);
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

    function addMember(address _newMember) public onlyGroupOwner {
    require(!members[_newMember], "This person is already a member of the group!");
    members[_newMember] = true;
    GroupFactory(groupFactoryAddress).updateUserGroups(_newMember, address(this), true);
    memberCount++;
    }

    
    function removeMember(address _memberAddress) public onlyGroupOwner {
    require(members[_memberAddress], "This person doesn't belong to the group!");
    members[_memberAddress] = false;
    GroupFactory(groupFactoryAddress).updateUserGroups(_memberAddress, address(this), false);
    memberCount--;
    }

    function checkPassword(bytes32 _hashedPassword) private view returns (bool) {
        return _hashedPassword == hashedPassword; 
    }

    function transferOwnership(address _newOwner) public onlyGroupOwner {
        require(members[_newOwner], "New owner must be a member of the group!");

        groupOwner = _newOwner;
    }


    function createPoll(string memory _question, string memory _option1, string memory _option2, uint256 _duration) public onlyGroupOwner {
    require(members[msg.sender], "You must be a member of this group to create a poll!");
    if (activePoll != address(0)) {
        bool hasEnded = Poll(activePoll).hasEnded();
        require(hasEnded, "There is already an active poll!");
    }

    Poll newPoll = new Poll(msg.sender, _question, _option1, _option2, _duration, address(this));
    polls.push(address(newPoll));
    activePoll = address(newPoll);

    }

    function getActivePoll() public view returns (address) {
        return activePoll;
    }

    function getPastPolls() public view returns (address[] memory, address) {
    if (polls.length == 0) {
        return (new address[](0), address(0));
    }

    address[] memory pastPolls = new address[](polls.length - 1);
    address lastPoll = address(0);
    uint256 pastPollIndex = 0;
    for (uint256 i = 0; i < polls.length - 1; i++) {
        if (polls[i] != activePoll) {
            pastPolls[pastPollIndex++] = polls[i];
            lastPoll = polls[i];
        }
    }
    return (pastPolls, lastPoll);
}

    function isMember(address _address) public view returns (bool) {
    return members[_address];
    }


}