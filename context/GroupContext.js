import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import GroupFactory from '@/artifacts/contracts/GroupFactory.sol/GroupFactory.json';
import { ethers } from 'ethers';

export const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const groupFactoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const { currentAccount } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [groupFactoryContract, setGroupFactoryContract] = useState(null);

  // Initialize the contract
  useEffect(() => {
    if (currentAccount && groupFactoryAddress) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(groupFactoryAddress, GroupFactory.abi, provider.getSigner());
      setGroupFactoryContract(contract);
    }
  }, [currentAccount, groupFactoryAddress]);

  const createNewGroup = async (groupName, isGroupPrivate, password) => {
    if (!groupFactoryContract) {
      console.error('GroupFactory contract not initialized');
      return;
    }

    const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(password));
    try {
      const transaction = await groupFactoryContract.createGroup(groupName, isGroupPrivate, hashedPassword);
      await transaction.wait();
      console.log('Group created successfully');
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <GroupContext.Provider value={{ createNewGroup }}>
      {children}
    </GroupContext.Provider>
  );
};

