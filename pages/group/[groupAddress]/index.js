import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { GroupContext } from '@/context/GroupContext';
import { AuthContext } from '@/context/AuthContext';
import { PollContext } from '@/context/PollContext';
import Sidebar from '@/components/Sidebar';
import styles from '@/components/Sidebar.module.css';
import GroupLayout from '@/components/GroupLayout';

const GroupPage = () => {
  const router = useRouter();
  const { groupAddress } = router.query;
  const { getGroupDetails } = useContext(GroupContext);
  const { currentAccount, isValidAddress } = useContext(AuthContext);
  const { getActivePoll, clearActivePoll, refreshActivePoll, endPoll, vote, hasVoted, getLastPoll, getLastPollWinner, getPollWinner, isPollEnded, getPollDetails } = useContext(PollContext);
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [group, setGroup] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [activePoll, setActivePoll] = useState(null);
  const [lastPollWinner, setLastPollWinner] = useState(null);
  const [lastPollDetails, setLastPollDetails] = useState(null);
  const [refreshLastPoll, setRefreshLastPoll] = useState(false);
  const [lastPollEnded, setLastPollEnded] = useState(false);
  const [lastPollAddress, setLastPollAddress] = useState(null);


  const handleCreatePoll = useCallback (() => {
    router.push(`/group/${groupAddress}/create-poll`);
    setLastPollEnded(false);
  }, [groupAddress, router]);


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

  const checkPollStatus = useCallback(async () => {
    if (activePoll) {
      const pollEndTime = new Date(activePoll.endTime * 1000).getTime(); // Convert to milliseconds
      const currentTime = new Date().getTime(); // In milliseconds
  
      if (currentTime >= pollEndTime) {
        await endPoll(activePoll.pollAddress);
        await clearActivePoll(groupAddress);
        await refreshActivePoll(groupAddress, setActivePoll);
        return true;
      }
    }
    return false;
  }, [activePoll, groupAddress, endPoll, clearActivePoll, refreshActivePoll]);
  

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
  }, [groupAddress, activePoll, refreshLastPoll, lastPollAddress]);

  useEffect(() => {
    const updateLastPollWinner = async () => {
      if (activePoll) {
        console.log("Fetching last poll winner...");
        const pastPolls = await getLastPoll(groupAddress);
        console.log("Last Poll Address:", pastPolls);
        
        if (isValidAddress(pastPolls)) {
          const winner = await getPollWinner(pastPolls);
          console.log("Last Poll Winner:", winner);
          setLastPollWinner(winner);
          
          const lastPoll = await getPollDetails(pastPolls);
          console.log("Last Poll Details:", lastPoll);
          setLastPollDetails(lastPoll);
        } else {
          console.log("Invalid Poll Address");
          setLastPollWinner("No last poll winner available.");
        }
      } else {
        console.log("No active poll");
      }
    };
  
    updateLastPollWinner();
  }, [activePoll, groupAddress, getLastPoll, getPollWinner, getPollDetails, isValidAddress]);
  
  



  useEffect(() => {
    if (activePoll) {
      const interval = setInterval(async () => {
        const pollEnded = await checkPollStatus();
        if (pollEnded) {
          setLastPollEnded(true);
        }
      }, 5000); // Check every 5 seconds
  
      return () => {
        clearInterval(interval);
      };
    }
  }, [activePoll, checkPollStatus]);

  
  
  

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

  return (
    group && (

    <GroupLayout
      isOwner={isOwner}
      onCreatePoll={handleCreatePoll}
      showCreatePoll={!activePoll}
    >
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
      </div>
    </GroupLayout>
  ));
};

export default GroupPage;

