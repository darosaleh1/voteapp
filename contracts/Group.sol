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
    address[] public memberAddresses;

    event MemberRemoved(address indexed user, address indexed group);


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
        memberAddresses.push(groupOwner);
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
        memberAddresses.push(msg.sender);
        GroupFactory(groupFactoryAddress).updateUserGroups(msg.sender, address(this), true);
        memberCount++;
    }


    function leaveGroup() public {
    require(members[msg.sender], "You are not a member of this group!");
    require(msg.sender != groupOwner, "Group owner cannot leave the group.");
    members[msg.sender] = false;
    _removeMemberAddress(msg.sender);
    GroupFactory(groupFactoryAddress).updateUserGroups(msg.sender, address(this), false);
    memberCount--;
}

    
    function removeMember(address _memberAddress) public onlyGroupOwner {
    require(members[_memberAddress], "This person doesn't belong to the group!");
    members[_memberAddress] = false;
    _removeMemberAddress(_memberAddress);
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

    uint256 pastPollsCount = activePoll == address(0) ? polls.length : polls.length - 1;

    address[] memory pastPolls = new address[](pastPollsCount);
    address lastPoll = address(0);
    uint256 pastPollIndex = 0;
    for (uint256 i = 0; i < polls.length; i++) {
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

    function getMembers() public view returns (address[] memory) {
        return memberAddresses;
    }

    function _removeMemberAddress(address _memberAddress) private {
        for (uint256 i = 0; i < memberAddresses.length; i++) {
            if (memberAddresses[i] == _memberAddress) {
                memberAddresses[i] = memberAddresses[memberAddresses.length - 1];
                memberAddresses.pop();
                break;
            }
        }
    }



}