import { createContext, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import GroupFactory from '@/artifacts/contracts/GroupFactory.sol/GroupFactory.json';
import { ethers } from 'ethers';
import Group from '@/artifacts/contracts/Group.sol/Group.json';


export const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const { currentAccount } = useContext(AuthContext);
  const groupFactoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";


  const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
  const signer = currentAccount ? provider.getSigner(currentAccount) : null;


  const groupFactoryContract = new ethers.Contract(
    groupFactoryAddress,
    GroupFactory.abi,
    signer
  );

  const createNewGroup = async (groupName, isGroupPrivate, password) => {
    if (!currentAccount || !signer) {
      throw new Error('User not connected');
    }

    const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(password));
    const tx = await groupFactoryContract.createGroup(groupName, isGroupPrivate, hashedPassword);
    await tx.wait();
  };

  
  const getAllGroups = async (currentAccount) => {
    if (!currentAccount) {
      throw new Error('User not connected');
    }
  
  
    const groups = await groupFactoryContract.getDeployedGroups();
  
    // Check if the list is empty
    if (groups.length === 0) {
      return [];
    }
  
    return groups;
  };

  const getGroupDetails = async (groupAddress) => {
    const groupContract = new ethers.Contract(groupAddress, Group.abi, signer);
    const groupName = await groupContract.groupName();
    const memberCount = await groupContract.memberCount();
    const isGroupPrivate = await groupContract.isGroupPrivate();
    const groupOwner = await groupContract.groupOwner(); // Add this line to get the groupOwner value
    return { groupName, memberCount, isGroupPrivate, groupOwner }; // Include groupOwner in the returned object
  };
  
  
  
  const getGroupMemberCount = async (groupAddress) => {
    const groupContract = new ethers.Contract(groupAddress, Group.abi, signer);
    const memberCount = await groupContract.memberCount();
    return memberCount;
  };
  
  const isMemberOfGroup = async (groupAddress, userAddress) => {
    const groupContract = new ethers.Contract(groupAddress, Group.abi, signer);
    const isMember = await groupContract.members(userAddress);
    return isMember;
  };
  

  const joinGroup = async (groupAddress, password, currentAccount) => {
    if (!currentAccount) {
      throw new Error('User not connected');
    }
  
    const groupContract = new ethers.Contract(groupAddress, Group.abi, signer);
    const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(password));
    const tx = await groupContract.joinGroup(hashedPassword);
    await tx.wait();
  };

  const getUserGroups = async (userAddress) => {
    const groupFactoryContract = new ethers.Contract(groupFactoryAddress, GroupFactory.abi, signer);
    const userGroupsAddresses = await groupFactoryContract.getUserGroups(userAddress);
    const userGroups = await Promise.all(
      userGroupsAddresses.map(async (groupAddress) => {
        const groupContract = new ethers.Contract(groupAddress, Group.abi, signer);
        const groupName = await groupContract.groupName();
        const memberCount = await groupContract.memberCount();
        return { groupName, memberCount, groupAddress };
      })
    );
    return userGroups;
  };

  const getAllMembers = async (groupAddress) => {
    const groupContract = new ethers.Contract(groupAddress, Group.abi, signer);
    const memberCount = await groupContract.memberCount();
    const members = [];
    for (let i = 0; i < memberCount; i++) {
      const memberAddress = await groupContract.members(i);
      if (memberAddress) {
        members.push(memberAddress);
      }
    }
    return members;
  };
  

  
  return (
    <GroupContext.Provider value={{ createNewGroup, getAllGroups, getGroupDetails, getGroupMemberCount, isMemberOfGroup, joinGroup, getUserGroups, getAllMembers }}>
      {children}
    </GroupContext.Provider>
  );
};


