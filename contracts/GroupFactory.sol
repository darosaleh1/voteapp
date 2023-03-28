// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Group.sol";

contract GroupFactory{

    address[] public createdGroups;

    function createGroup(string memory _groupName, bool _isGroupPrivate, bytes32 _hashedPassword, bytes32 _salt) public {
        Group newGroup = new Group(_groupName, _isGroupPrivate, _hashedPassword, _salt);
        createdGroups.push(address(newGroup));
    }

    function getDeployedGroups() public view returns (address[] memory) {
        return createdGroups;
    }
}