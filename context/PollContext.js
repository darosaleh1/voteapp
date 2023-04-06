import { createContext, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { ethers } from 'ethers';
import Group from '@/artifacts/contracts/Group.sol/Group.json';
import Poll from '@/artifacts/contracts/Poll.sol/Poll.json';

export const PollContext = createContext();

export const PollProvider = ({ children }) => {
  const { currentAccount } = useContext(AuthContext);

  const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
  const signer = currentAccount ? provider.getSigner(currentAccount) : null;

  const createPoll = async (groupAddress, question, option1, option2, duration) => {
    if (!currentAccount || !signer) {
      throw new Error('User not connected');
    }

    const groupContract = new ethers.Contract(groupAddress, Group.abi, signer);
    const tx = await groupContract.createPoll(question, option1, option2, duration);
    await tx.wait();
  };

  // Add more poll-related functions here

  return (
    <PollContext.Provider
      value={{
        createPoll,
        // Add more functions to the context value here
      }}
    >
      {children}
    </PollContext.Provider>
  );
};
