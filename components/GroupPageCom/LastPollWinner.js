import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { PollContext } from '@/context/PollContext';

const LastPollWinner = ({ groupAddress }) => {
  const { getLastPoll, getLastPollWinner, getPollDetails } = useContext(PollContext);
  const [lastPollWinner, setLastPollWinner] = useState(null);
  const [lastPollDetails, setLastPollDetails] = useState(null);

  useEffect(() => {
    const fetchLastPollWinner = async () => {
      if (!groupAddress) {
        return;
      }

      const winner = await getLastPollWinner(groupAddress);

      if (winner) {
        const lastPollAddr = await getLastPoll(groupAddress);
        const lastPoll = await getPollDetails(lastPollAddr);
        setLastPollDetails(lastPoll);
        setLastPollWinner(winner);
      } else {
        setLastPollWinner("No last poll winner available.");
      }
    };

    fetchLastPollWinner();
  }, [groupAddress, getLastPollWinner, getLastPoll, getPollDetails]);

  return (
    <div>
      <h2>Last Poll Winner</h2>
      {lastPollWinner ? (
        <>
          {lastPollDetails && <p>Question: {lastPollDetails.question}</p>}
          <p>Winner: {lastPollWinner}</p>
        </>
      ) : (
        <p>No last poll winner available.</p>
      )}
    </div>
  );
};

export default LastPollWinner;
