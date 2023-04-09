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
  console.log("Poll duration (seconds):", duration);
  console.log("Poll creation time:", new Date().getTime());
  console.log("Expected poll end time:", new Date().getTime() + duration * 1000);
  };

  const getPollDetails = async (pollAddress) => {
    if (!currentAccount || !signer) {
      throw new Error('User not connected');
    }
  
    const pollContract = new ethers.Contract(pollAddress, Poll.abi, provider);
    const option1 = await pollContract.getOption(0);
    const option2 = await pollContract.getOption(1);
    const pollData = await pollContract.pollData();
    const question = await pollData.question;
    const endTime = pollData.endTime;
  
    return {
      question,
      option1,
      option2,
      endTime: ethers.BigNumber.from(endTime).toNumber(), // In seconds
    };
  }

  const getPollContract = (pollAddress) => {
    if (!currentAccount || !signer) {
      throw new Error('User not connected');
    }
  
    return new ethers.Contract(pollAddress, Poll.abi, signer);
  };
  

    
  
  
  
  
  

  const vote = async (pollAddress, optionIndex) => {
    if (!currentAccount || !signer) {
      throw new Error('User not connected');
    }
  
    const pollContract = new ethers.Contract(pollAddress, Poll.abi, signer);
    const tx = await pollContract.vote(optionIndex);
    await tx.wait();
  };
  
  

  

  const getUserVote = async (pollAddress) => {
    if (!currentAccount || !signer) {
      throw new Error('User not connected');
    }

    const pollContract = new ethers.Contract(pollAddress, Poll.abi, provider);
    const [optionIndex, hasVoted] = await pollContract.getUserVote(currentAccount);

    return { optionIndex, hasVoted };
  };

  const getActivePoll = async (groupAddress) => {
    try {
      const groupContract = new ethers.Contract(groupAddress, Group.abi, signer);
      const activePollAddress = await groupContract.getActivePoll();
  
      // Check if activePollAddress is a valid Ethereum address
      if (ethers.utils.isAddress(activePollAddress) && activePollAddress !== ethers.constants.AddressZero) {
        const activePoll = await getPollDetails(activePollAddress);
        const endTime = activePoll.endTime;
        const formattedEndTime = new Date(endTime * 1000).toLocaleString();
        const creationTime = (endTime - activePoll.duration) * 1000;
        const formattedCreationTime = new Date(creationTime).toLocaleString();
        return { ...activePoll, endTime, formattedEndTime, formattedCreationTime, pollAddress: activePollAddress }; // Include the pollAddress and formattedCreationTime in the activePoll object
      }
    } catch (error) {
      console.error("Error while getting active poll:", error);
    }
    return null;
  };
  
  
  
  

  const clearActivePoll = async (groupAddress) => {
    if (!currentAccount || !signer) {
      throw new Error('User not connected');
    }
  
    const groupContract = new ethers.Contract(groupAddress, Group.abi, signer);
    await groupContract.clearActivePoll();
  };

  const refreshActivePoll = async (groupAddress, setActivePoll) => {
    const newActivePollData = await getActivePoll(groupAddress);
    setActivePoll(newActivePollData);
  };

  const hasEnded = async (pollAddress) => {
    if (!currentAccount || !signer) {
      throw new Error('User not connected');
    }
  
    const pollContract = new ethers.Contract(pollAddress, Poll.abi, provider);
    const pollData = await pollContract.pollData();
    const pollHasEnded = pollData.hasEnded;
    return pollHasEnded;
  };

  const endPoll = async (pollAddress) => {
    if (!currentAccount || !signer) {
      throw new Error('User not connected');
    }
  
    const pollContract = new ethers.Contract(pollAddress, Poll.abi, signer);
    const transaction = await pollContract.endPoll();
    await transaction.wait();
  };

  const hasVoted = async (pollAddress, userAddress) => {
    try {
      const pollContract = new ethers.Contract(pollAddress, Poll.abi, signer);
      const [, hasVoted] = await pollContract.getUserVote(userAddress);
      return hasVoted;
    } catch (error) {
      console.error("Error checking if user has voted:", error);
      return false;
    }
  };

  const getGroupContract = (groupAddress) => {
    if (!currentAccount || !signer) {
      throw new Error('User not connected');
    }

    return new ethers.Contract(groupAddress, Group.abi, signer);
  };

  const getLastPoll = async (groupAddress) => {
    try {
      const groupContract = getGroupContract(groupAddress);
      const [, lastPoll] = await groupContract.getPastPolls();
      console.log("Last poll address:", lastPoll);
      return lastPoll;
    } catch (error) {
      console.error("Error while fetching the last poll:", error);
      return null;
    }
  };
  

  

  const getLastPollWinner = async (groupAddress) => {
    const groupContract = new ethers.Contract(groupAddress, Group.abi, signer);
    const [, lastPollAddress] = await groupContract.getPastPolls();
    
    if (lastPollAddress === ethers.constants.AddressZero) {
      return null;
    }
    
    const lastPollContract = new ethers.Contract(lastPollAddress, Poll.abi, signer);
    const winner = await lastPollContract.getWinner();
    return winner;
  };

  const getPollWinner = async (pollAddress) => {
    const pollInstance = getPollContract(pollAddress);
    const winner = await pollInstance.getWinner();
    return winner;
  };

  const isPollEnded = async (pollAddress) => {
    const pollContract = getPollContract(pollAddress);
    const pollData = await pollContract.pollData();
    const hasEnded = pollData.hasEnded;
    return hasEnded;
  };

  const getPastPolls = async (groupAddress) => {
    if (!currentAccount || !signer) {
      throw new Error('User not connected');
    }
  
    const groupContract = getGroupContract(groupAddress);
    const [pastPollAddresses] = await groupContract.getPastPolls();
  
    const pastPolls = await Promise.all(
      pastPollAddresses.map(async (pollAddress) => {
        const pollDetails = await getPollDetails(pollAddress);
        const winner = await getPollWinner(pollAddress);
        return {
          question: pollDetails.question,
          pollAddress,
          winner,
        };
      })
    );
  
    return pastPolls;
  };

  const getVoteDetails = async (pollAddress, optionIndex, startIndex, count) => {
    if (!currentAccount || !signer) {
      throw new Error('User not connected');
    }

    const pollContract = new ethers.Contract(pollAddress, Poll.abi, provider);
    const voteDetails = await pollContract.getVoteDetails(optionIndex, startIndex, count);
    return voteDetails;
  };

  const getVoteCount = async (pollAddress, optionIndex) => {
    if (!currentAccount || !signer) {
      throw new Error('User not connected');
    }

    const pollContract = new ethers.Contract(pollAddress, Poll.abi, provider);
    const voteCount = await pollContract.getVoteCount(optionIndex);
    return voteCount;
  };
  
  


  
  


  return (
    <PollContext.Provider
      value={{
        createPoll,
        getPollDetails,
        getUserVote,
        getActivePoll,
        vote,
        clearActivePoll,
        refreshActivePoll,
        hasEnded,
        endPoll,
        hasVoted,
        getLastPollWinner,
        getPollWinner,
        getLastPoll,
        getPollContract,
        isPollEnded,
        getPastPolls,
        getVoteDetails,
        getVoteCount,
      }}
    >
      {children}
    </PollContext.Provider>
  );
};

