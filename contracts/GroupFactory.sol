// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Group.sol";

contract GroupFactory{

    address[] public createdGroups;
    mapping(address => address[]) public userGroups;
    mapping(string => bool) public groupNameExists;

    event GroupCreated(address indexed groupAddress, address indexed owner);

    function createGroup(string memory _groupName, bool _isGroupPrivate, bytes32 _hashedPassword) public {
        require(!groupNameExists[_groupName], "Group name already exists!");
        require(bytes(_groupName).length > 0, "Group name cannot be empty!");

        groupNameExists[_groupName] = true;
        Group newGroup = new Group(_groupName, _isGroupPrivate, _hashedPassword, address(this), msg.sender);
        createdGroups.push(address(newGroup));

        emit GroupCreated(address(newGroup), msg.sender);
    }


    function getDeployedGroups() public view returns (address[] memory) {
        return createdGroups;
    }

    function updateUserGroups(address _user, address _group, bool _isJoining) external {
        require(msg.sender == _group, "Only the group contract can update user groups.");

        if (_isJoining) {
            userGroups[_user].push(_group);
        } else {
            for (uint256 i = 0; i < userGroups[_user].length; i++) {
                if (userGroups[_user][i] == _group) {
                    userGroups[_user][i] = userGroups[_user][userGroups[_user].length - 1];
                    userGroups[_user].pop();
                    break;
                }
            }
        }
    }

    function getUserGroups(address _user) public view returns (address[] memory) {
        return userGroups[_user];
    }


}
