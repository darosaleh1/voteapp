import React from 'react';
import { useRouter } from 'next/router';
import GroupLayout from '@/components/GroupPageCom/GroupLayout';
import LeavingGroup from '@/components/LeavingGroup';
import ActivePoll from '@/components/GroupPageCom/ActivePoll';
import LastPollWinner from '@/components/GroupPageCom/LastPollWinner';
import useGroupDetails from '@/hooks/useGroupDetails';
import useActivePoll from '@/hooks/useActivePoll';
import useUserVoteStatus from '@/hooks/useUserVoteStatus';
import usePollStatus from '@/hooks/usePollStatus';
import useLeaveGroup from '@/hooks/useLeaveGroup';


const GroupPage = () => {
  const router = useRouter();
  const { groupAddress } = router.query;
  const { group, isOwner, handleCreatePoll } = useGroupDetails(groupAddress);
  const { activePoll, handleVote, handleClaimNFT, endPollHandler } = useActivePoll(groupAddress);
  const { userHasVoted } = useUserVoteStatus(groupAddress, activePoll);
  const { pollEnded } = usePollStatus(activePoll);
  const { leavingGroup, handleLeaveGroup } = useLeaveGroup(groupAddress);

  
  if (!group) {
    return <div>Loading...</div>;
  }

  const { groupName } = group;

  return (
    group && (
      <GroupLayout
        isOwner={isOwner}
        onCreatePoll={handleCreatePoll}
        showCreatePoll={!activePoll}
      >
        {leavingGroup ? (
        <LeavingGroup />
      ) : (
        <div>
        <ActivePoll
          activePoll={activePoll}
          userHasVoted={userHasVoted}
          handleVote={handleVote}
          handleClaimNFT={handleClaimNFT}
          isOwner={isOwner}
          pollEnded={pollEnded}
          endPollHandler={endPollHandler}
        />
        <LastPollWinner groupAddress={groupAddress} />
        {!isOwner && (
            <button onClick={handleLeaveGroup}>Leave Group</button>
          )}
        </div>
      )}
      </GroupLayout>
    )
  );
};

export default GroupPage; 
