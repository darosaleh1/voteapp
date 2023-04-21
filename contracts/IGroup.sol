// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IGroup {
    function isMember(address _address) external view returns (bool);
    function groupOwner() external view returns (address);

}
