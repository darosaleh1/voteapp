import React, { useState, useEffect, useContext } from 'react';
import { GroupContext } from '@/context/GroupContext';
import { AuthContext } from '@/context/AuthContext';
import styles from './BrowseGroups.module.css';
import BrowseGroupCard from './GroupCards/BrowseGroupCard';

const BrowseGroups = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const { getAllGroups, getGroupDetails, isGroupMember, joinGroup } = useContext(GroupContext);
  const { currentAccount } = useContext(AuthContext);

  const handleGroupJoinClick = (group) => {
    if (group.isPasswordProtected) {
      setSelectedGroup(group);
    } else {
      handleJoinGroup(null, group.address);
    }
  };

  useEffect(() => {
    const fetchGroups = async () => {
      const groupAddresses = await getAllGroups(currentAccount);
      const groups = await Promise.all(
        groupAddresses.map(async (address) => {
          const details = await getGroupDetails(address);
          const isMember = await isGroupMember(address, currentAccount);
          return {
            address,
            groupName: details.groupName,
            memberCount: details.memberCount.toNumber(),
            isMember,
            isPasswordProtected: details.isGroupPrivate,
          };
        })
      );
      setGroups(groups);
    };
    if (currentAccount) {
      fetchGroups();
    }
  }, [currentAccount]);

  
  
  const handleJoinGroup = async (password, groupAddress) => {
    try {
      const address = groupAddress || selectedGroup.address;
      await joinGroup(address, password || '', currentAccount); 
      setSelectedGroup(null);
      alert('Successfully joined the group!');
    } catch (error) {
      console.error('Error joining the group:', error);
      alert('Error joining the group');
    }
  };
  
  
  const togglePasswordModal = () => {
    setSelectedGroup(null);
  };
  
  const PasswordModal = () => {
    const [password, setPassword] = useState('');
  
    if (!selectedGroup) {
      return null;
    }
  
    return (
      <div className={`${styles.modal} ${selectedGroup ? styles.modalVisible : ''}`}>
        <div className={styles.modalContent}>
          <h2>Enter Password</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter group password"
          />
          <button onClick={() => handleJoinGroup(password)}>Join</button>
          <button onClick={togglePasswordModal}>Close</button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1>All Groups</h1>
      <div>
        {groups.map((group) => (
          <BrowseGroupCard key={group.address} group={group} onJoin={handleGroupJoinClick} />
        ))}
      </div>
      <PasswordModal />
    </div>
  );
};
export default BrowseGroups;



