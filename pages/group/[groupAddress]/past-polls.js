import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GroupContext } from '@/context/GroupContext';
import { PollContext } from '@/context/PollContext';

const PastPolls = () => {
  const router = useRouter();
  const { groupAddress } = router.query;
  const { getGroupDetails } = useContext(GroupContext);
  const { getPastPolls } = useContext(PollContext);
  const [group, setGroup] = useState(null);
  const [pastPolls, setPastPolls] = useState([]);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (groupAddress) {
        const groupDetails = await getGroupDetails(groupAddress);
        setGroup(groupDetails);
      }
    };

    const fetchPastPolls = async () => {
      if (groupAddress) {
        const pastPollsData = await getPastPolls(groupAddress);
        setPastPolls(pastPollsData);
      }
    };

    fetchGroupDetails();
    fetchPastPolls();
  }, [groupAddress]);

  if (!group) {
    return <div>Loading...</div>;
  }

  const { groupName } = group;

  return (
    <div>
      <h1>{groupName} - Past Polls</h1>
      <ul>
        {pastPolls.map((poll, index) => (
          <li key={index}>
            Poll {index + 1}: {poll.question} - Winner: {poll.winner}
            <button
              onClick={() => router.push(`/group/${groupAddress}/vote-details/${poll.pollAddress}`)}
            >
              Vote Details
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
  
  
};

export default PastPolls;
