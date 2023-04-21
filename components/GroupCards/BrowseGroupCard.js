import React from 'react';
import styles from './BrowseGroupCard.module.css';

const BrowseGroupCard = ({ group, onJoin }) => {
  const { groupName, memberCount, groupAddress, isMember, isPasswordProtected } = group;

  const renderJoinButton = () => {
    if (!isMember) {
      return (
        <button
          className={styles.joinGroupButton}
          onClick={(e) => {
            e.preventDefault();
            onJoin(group);
          }}
        >
          Join
        </button>
      );
    }
  };

  return (
    <div className={styles.groupCard}>
      <h3 className={styles.groupName}>{groupName}</h3>
      <p className={styles.memberCount}>Members: {memberCount.toString()}</p>
      <p className={styles.groupAddress}>Address: {groupAddress}</p>
      <p>Type: {isPasswordProtected ? "Private" : "Public"}</p>
      {renderJoinButton()}
    </div>
  );
};

export default BrowseGroupCard;