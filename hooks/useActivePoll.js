import { useState, useEffect, useContext } from 'react';
import { PollContext } from '@/context/PollContext';

const useActivePoll = (groupAddress) => {
  const { getActivePoll, endPoll, vote, claimNFT, refreshActivePoll, clearActivePoll } = useContext(PollContext);
  const [activePoll, setActivePoll] = useState(null);

  useEffect(() => {
    const fetchActivePoll = async () => {
      if (groupAddress) {
        const activePollData = await getActivePoll(groupAddress);
        if (activePollData) {
          setActivePoll(activePollData);
        } else {
          setActivePoll(null);
        }
      }
    };

    fetchActivePoll();
  }, [groupAddress]);

  const handleVote = async (optionIndex) => {
    try {
      await vote(activePoll.pollAddress, optionIndex);
    } catch (error) {
      console.error("Error while voting:", error);
    }
  };

  const handleClaimNFT = async () => {
    try {
      await claimNFT(activePoll.pollAddress);
      console.log("NFT claimed successfully");
    } catch (error) {
      console.error("Error while claiming NFT:", error);
    }
  };

  const endPollHandler = async () => {
    if (activePoll) {
      await endPoll(activePoll.pollAddress);
      await clearActivePoll(groupAddress);
      await refreshActivePoll(groupAddress, setActivePoll);
    }
  };

  return { activePoll, handleVote, handleClaimNFT, endPollHandler };
};

export default useActivePoll;
