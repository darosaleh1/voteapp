import React from 'react';

const ActivePoll = ({ activePoll, userHasVoted, handleVote, handleClaimNFT, isOwner, pollEnded, endPollHandler }) => {
  return (
    <div  >
      <h2>Active Poll</h2>
      {activePoll ? (
        <>
          <h3>{activePoll.question}</h3>
          <p>
            Option 1: {activePoll.option1} - Option 2: {activePoll.option2}
          </p>
          <p>End Time: {activePoll.formattedEndTime}</p>
          {!pollEnded && !isOwner && (
            <>
              {userHasVoted ? (
                <p>User has already voted!</p>
              ) : (
                <>
                  <button onClick={() => handleVote(0)}>Vote for Option 1</button>
                  <button onClick={() => handleVote(1)}>Vote for Option 2</button>
                </>
              )}
            </>
          )}
          {userHasVoted && (
              <button onClick={handleClaimNFT}>Claim NFT</button>
            )}
          {isOwner && pollEnded && (
            <button onClick={endPollHandler}>End Poll</button>
          )}
        </>
      ) : (
        <p>No active poll.</p>
      )}
    </div>
  );
};

export default ActivePoll;


