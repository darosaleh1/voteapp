import React, { useContext, useEffect, useState } from 'react';
import { GroupContext } from '@/context/GroupContext';
import { AuthContext } from '@/context/AuthContext';
import GroupCard from './GroupCard';

const MyGroups = () => {
  const { currentAccount} = useContext(AuthContext);
  const { getUserGroups } = useContext(GroupContext);
  const [myGroups, setMyGroups] = useState([]);

  useEffect(() => {
    const fetchUserGroups = async () => {
      if (currentAccount) {
        console.log('Current Account:', currentAccount);
        const groups = await getUserGroups(currentAccount);
        console.log('Fetched Groups:', groups);
        setMyGroups(groups);
      }
    };

    fetchUserGroups();
  }, [currentAccount, getUserGroups]);

  return (
    <div>
      <h2>My Groups</h2>
      <div>
        {myGroups.map((group, index) => (
          <GroupCard key={index} group={group} />
        ))}
      </div>
    </div>
  );
};

export default MyGroups;
