import React, { useState, useEffect, useContext } from 'react';
import { GroupContext } from '@/context/GroupContext';
import { AuthContext } from '@/context/AuthContext';
import styles from './Groups.module.css';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const { getAllGroups, getGroupDetails, isMemberOfGroup, joinGroup } = useContext(GroupContext);
  const { currentAccount } = useContext(AuthContext);

  useEffect(() => {
    const fetchGroups = async () => {
      const groupAddresses = await getAllGroups(currentAccount);
      const groups = await Promise.all(
        groupAddresses.map(async (address) => {
          const details = await getGroupDetails(address);
          const isMember = await isMemberOfGroup(address, currentAccount);
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

  const renderJoinButton = (group) => {
    if (!group.isMember) {
      return (
        <button
          onClick={(e) => {
            e.preventDefault(); // Add this line to prevent the default action
            if (group.isPasswordProtected) {
              setSelectedGroup(group);
            } else {
              handleJoinGroup(null, group.address);
            }
          }}
        >
          Join
        </button>
      );
    }
  };
  
  const handleJoinGroup = async (password, groupAddress) => {
    try {
      const address = groupAddress || selectedGroup.address;
      await joinGroup(address, password, currentAccount);
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
      <ul>
        {groups.map((group, index) => (
          <li key={index}>
            Name: {group.groupName}, Address: {group.address}, Members: {group.memberCount}, Type:{" "}
            {group.isPasswordProtected ? "Private" : "Public"}
            {renderJoinButton(group)}
          </li>
        ))}
      </ul>
      <PasswordModal />
    </div>
  );
};

export default Groups;



