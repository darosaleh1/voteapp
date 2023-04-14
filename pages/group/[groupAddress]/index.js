import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { GroupContext } from '@/context/GroupContext';
import { AuthContext } from '@/context/AuthContext';
import { PollContext } from '@/context/PollContext';
import Sidebar from '@/components/Sidebar';
import styles from '@/components/Sidebar.module.css';
import GroupLayout from '@/components/GroupLayout';
import LeavingGroup from '@/components/LeavingGroup';


const GroupPage = () => {
  const router = useRouter();
  const { groupAddress } = router.query;
  const { getGroupDetails, leaveGroup } = useContext(GroupContext);
  const { currentAccount, isValidAddress } = useContext(AuthContext);
  const { getActivePoll, clearActivePoll, refreshActivePoll, endPoll, vote, hasVoted, getLastPoll, getLastPollWinner, getPollWinner, isPollEnded, getPollDetails, claimNFT } = useContext(PollContext);
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [group, setGroup] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [activePoll, setActivePoll] = useState(null);
  const [pollEnded, setPollEnded] = useState(false);
  const [refreshLastPoll, setRefreshLastPoll] = useState(false);
  const [lastPollAddress, setLastPollAddress] = useState(null);
  const [lastPollWinner, setLastPollWinner] = useState(null);
  const [lastPollDetails, setLastPollDetails] = useState(null);
  const [leavingGroup, setLeavingGroup] = useState(false);





  const handleCreatePoll = useCallback(() => {
    router.push(`/group/${groupAddress}/create-poll`);
  }, [groupAddress, router]);

  useEffect(() => {
    const fetchLastPollWinner = async () => {
      if (!groupAddress) {
        return;
      }
  
      const winner = await getLastPollWinner(groupAddress);
  
      if (winner) {
        const lastPollAddr = await getLastPoll(groupAddress);
        setLastPollAddress(lastPollAddr);
        const lastPoll = await getPollDetails(lastPollAddr);
        setLastPollDetails(lastPoll);
        setLastPollWinner(winner);
      } else {
        setLastPollWinner("No last poll winner available.");
      }
    };
  
    fetchLastPollWinner();
  }, [groupAddress, refreshLastPoll, lastPollAddress]);
  
  
  

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (groupAddress) {
        const groupDetails = await getGroupDetails(groupAddress);
        setGroup(groupDetails);
        setIsOwner(
          groupDetails.groupOwner.toLowerCase() === currentAccount.toLowerCase()
        );
      }
    };

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

    fetchGroupDetails();
    fetchActivePoll();
  }, [groupAddress, currentAccount]);

  useEffect(() => {
    const fetchUserVoteStatus = async () => {
      if (groupAddress && activePoll) {
        const userVoteStatus = await hasVoted(activePoll.pollAddress, currentAccount);
        setUserHasVoted(userVoteStatus);
      }
    };

    fetchUserVoteStatus();
  }, [groupAddress, currentAccount, activePoll]);

  const checkPollStatus = useCallback(() => {
    if (activePoll) {
      const pollEndTime = new Date(activePoll.endTime * 1000).getTime();
      const currentTime = new Date().getTime(); 

      if (currentTime >= pollEndTime) {
        return true;
      }
    }
    return false;
  }, [activePoll]);

  useEffect(() => {
    if (activePoll) {
      setPollEnded(checkPollStatus());
    }
  }, [activePoll, checkPollStatus]);

  const endPollHandler = async () => {
    if (activePoll) {
      await endPoll(activePoll.pollAddress);
      await clearActivePoll(groupAddress);
      await refreshActivePoll(groupAddress, setActivePoll);
      setPollEnded(false);
    }
  };

  if (!group) {
    return <div>Loading...</div>;
  }

  const { groupName } = group;

  const handleVote = async (optionIndex) => {
    try {
      await vote(activePoll.pollAddress, optionIndex);
      const userVoteStatus = await hasVoted(activePoll.pollAddress, currentAccount);
      setUserHasVoted(userVoteStatus);
    } catch (error) {
      console.error("Error while voting:", error);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      setLeavingGroup(true);
      await leaveGroup(groupAddress);
      router.push('/');
    } catch (error) {
      console.error("Error leaving the group:", error);
      setLeavingGroup(false);
    }
  };

  const handleClaimNFT = async () => {
    try {
      await claimNFT(activePoll.pollAddress, currentAccount);
      console.log("NFT claimed successfully");
    } catch (error) {
      console.error("Error while claiming NFT:", error);
    }
  };
  
  
  
  

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
            <h1>{groupName}</h1>
            <p style={{ fontSize: "0.8rem" }}>Group Address: {groupAddress}</p>
            <h2>Active Poll</h2>
            {activePoll ? (
              <>
                <h3>{activePoll.question}</h3>
                <p>
                  Option 1: {activePoll.option1} - Option 2: {activePoll.option2}
                </p>
                <p>End Time: {activePoll.formattedEndTime}</p>
                {userHasVoted ? (
                  <p>User has already voted!</p>
                ) : (
                  <>
                    <button onClick={() => handleVote(0)}>Vote for Option 1</button>
                    <button onClick={() => handleVote(1)}>Vote for Option 2</button>
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
  
            <h2>Last Poll Winner</h2>
            {lastPollWinner ? (
              <>
                {lastPollDetails && <p>Question: {lastPollDetails.question}</p>}
                <p>Winner: {lastPollWinner}</p>
              </>
            ) : (
              <p>No last poll winner available.</p>
            )}
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

