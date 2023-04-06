// pages/group/[groupAddress].js
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GroupContext } from '@/context/GroupContext';
import { AuthContext } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';

const GroupPage = () => {
  const router = useRouter();
  const { groupAddress } = router.query;
  const { getGroupDetails } = useContext(GroupContext);
  const { currentAccount } = useContext(AuthContext);
  const [group, setGroup] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (groupAddress) {
        const groupDetails = await getGroupDetails(groupAddress);
        setGroup(groupDetails);
        setIsOwner(groupDetails.groupOwner === currentAccount);
      }
    };

    fetchGroupDetails();
  }, [groupAddress, getGroupDetails, currentAccount]);

  if (!group) {
    return <div>Loading...</div>;
  }

  const { groupName } = group;

  const handleCreatePoll = () => {
    router.push(`/groups/${groupAddress}/create-poll`);
  };

  return (
    <div>
      <Sidebar isOwner={isOwner} onCreatePoll={handleCreatePoll} />
      <div style={{ marginLeft: '200px', transition: 'margin-left 0.3s' }}> {/* Add this div and style */}
        <h1>{groupName}</h1>
        <p style={{ fontSize: '0.8rem' }}>Group Address: {groupAddress}</p>
      </div>
    </div>
  );
};

export default GroupPage;



