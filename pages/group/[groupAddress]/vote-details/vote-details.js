import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PollContext } from '@/context/PollContext';

const VoteDetails = () => {
  const router = useRouter();
  const { groupAddress, pollAddress } = router.query;
  const { getPollDetails, getVoteDetails, getVoteCount } = useContext(PollContext);
  const [poll, setPoll] = useState(null);
  const [option1Votes, setOption1Votes] = useState([]);
  const [option2Votes, setOption2Votes] = useState([]);

  useEffect(() => {
    const fetchPollDetails = async () => {
      if (pollAddress) {
        const pollDetails = await getPollDetails(pollAddress);
        setPoll(pollDetails);
      }
    };

    const fetchVotes = async () => {
      if (pollAddress) {
        const option1VoteCount = await getVoteCount(pollAddress, 0);
        const option2VoteCount = await getVoteCount(pollAddress, 1);

        const option1VoteDetails = await getVoteDetails(pollAddress, 0, 0, option1VoteCount);
        const option2VoteDetails = await getVoteDetails(pollAddress, 1, 0, option2VoteCount);

        setOption1Votes(option1VoteDetails);
        setOption2Votes(option2VoteDetails);
      }
    };

    fetchPollDetails();
    fetchVotes();
  }, [pollAddress]);

  const goBackToPastPolls = () => {
    router.push(`/group/${groupAddress}/past-polls`);
  };

  const openEtherscan = (transactionId) => {
    window.open(`https://sepolia.etherscan.io/tx/${transactionId}`, '_blank');
  };

  if (!poll) {
    return <div>Loading...</div>;
  }

  const { question, option1, option2 } = poll;

  return (
    <div>
      <h1>{question} - Vote Details</h1>
      <h2>Option 1: {option1} (Total Votes: {option1Votes.length})</h2>
      <ul>
        {option1Votes.map((vote, index) => (
          <li key={index}>
            Voter {index + 1}: {vote.voter}, Block Number: {vote.blockNumber.toString()}, Block Timestamp: {new Date(vote.blockTimestamp * 1000).toLocaleString()}, Transaction ID: {vote.transactionId} <button onClick={() => openEtherscan(vote.transactionId)}>View on Etherscan</button>
          </li>
        ))}
      </ul>
      <h2>Option 2: {option2} (Total Votes: {option2Votes.length})</h2>
      <ul>
        {option2Votes.map((vote, index) => (
          <li key={index}>
            Voter {index + 1}: {vote.voter}, Block Number: {vote.blockNumber.toString()}, Block Timestamp: {new Date(vote.blockTimestamp * 1000).toLocaleString()}, Transaction ID: {vote.transactionId} <button onClick={() => openEtherscan(vote.transactionId)}>View on Etherscan</button>
          </li>
        ))}
      </ul>
      <button onClick={goBackToPastPolls}>Back to Past Polls</button>
    </div>
  );
};

export default VoteDetails;


