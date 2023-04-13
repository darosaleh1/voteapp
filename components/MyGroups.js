import React, { useContext, useEffect, useState } from 'react';
import { GroupContext } from '@/context/GroupContext';
import { AuthContext } from '@/context/AuthContext';
import GroupCard from './GroupCard';

const MyGroups = () => {
  const { currentAccount } = useContext(AuthContext);
  const { getUserGroups } = useContext(GroupContext);
  const [myGroups, setMyGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserGroups = async () => {
      if (currentAccount) {
        setIsLoading(true);
        console.log('Current Account:', currentAccount);
        const groups = await getUserGroups(currentAccount);
        console.log('Fetched Groups:', groups);
        setMyGroups(groups);
        setIsLoading(false);
      }
    };

    fetchUserGroups();
  }, [currentAccount, getUserGroups]);

  const loadingStyle = {
    fontSize: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 100px)',
  };

  return (
    <div>
      <h2>My Groups</h2>
      <div>
        {isLoading ? (
          <div style={loadingStyle}>Loading...</div>
        ) : (
          myGroups.map((group, index) => (
            <GroupCard key={index} group={group} />
          ))
        )}
      </div>
    </div>
  );
};

export default MyGroups;


