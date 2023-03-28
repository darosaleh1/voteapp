// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Group {
    string public groupName;
    uint256 public memberCount;
    bool public isGroupPrivate;
    bytes32 private hashedPassword;
    bytes32 private salt;
    mapping(address => bool) public members;



    constructor(string memory _groupName, bool _isGroupPrivate, bytes32 _hashedPassword, bytes32 _salt) {
    groupName = _groupName;
    isGroupPrivate = _isGroupPrivate;

    // Add the group creator as a member
    address groupCreator = msg.sender;
    members[groupCreator] = true;
    memberCount++;

    if (isGroupPrivate){
        require(_hashedPassword != bytes32(0), "Private Group must have a non-empty password");
        hashedPassword = _hashedPassword;
        salt = _salt;
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

    function getGroupDetails() public view returns (string memory, bool) {
    return (groupName, isGroupPrivate);
}

    function removeMember(address _memberAddress) public {
        require(members[_memberAddress], "This person doesn't belong to the group!");
        members[_memberAddress] = false;
        memberCount--;
    }

    function checkPassword(bytes32 _hashedPassword) private view returns (bool) {
        return _hashedPassword == hashedPassword; 
    }

}