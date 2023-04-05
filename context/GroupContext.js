import { createContext, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import GroupFactory from '@/artifacts/contracts/GroupFactory.sol/GroupFactory.json';
import { ethers } from 'ethers';

export const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const { currentAccount } = useContext(AuthContext);
  const groupFactoryAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

  const createNewGroup = async (groupName, isGroupPrivate, password) => {
    if (!currentAccount) {
      throw new Error('User not connected');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(currentAccount);

    const groupFactoryContract = new ethers.Contract(
      groupFactoryAddress,
      GroupFactory.abi,
      signer
    );

    const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(password));
    const tx = await groupFactoryContract.createGroup(groupName, isGroupPrivate, hashedPassword);
    await tx.wait();
  };

  return (
    <GroupContext.Provider value={{ createNewGroup }}>
      {children}
    </GroupContext.Provider>
  );
};


