import { useState, useEffect, useContext } from 'react';
import { PollContext } from '@/context/PollContext';
import { AuthContext } from '@/context/AuthContext';

const useUserVoteStatus = (groupAddress, activePoll) => {
  const { hasVoted } = useContext(PollContext);
  const { currentAccount } = useContext(AuthContext);
  const [userHasVoted, setUserHasVoted] = useState(false);

  useEffect(() => {
    const fetchUserVoteStatus = async () => {
      if (groupAddress && activePoll) {
        const userVoteStatus = await hasVoted(activePoll.pollAddress, currentAccount);
        setUserHasVoted(userVoteStatus);
      }
    };

    fetchUserVoteStatus();
  }, [groupAddress, currentAccount, activePoll]);

  return { userHasVoted };
};

export default useUserVoteStatus;
