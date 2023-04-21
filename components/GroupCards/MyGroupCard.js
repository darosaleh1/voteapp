import React from 'react';
import Link from 'next/link';
import styles from './MyGroupCard.module.css';

const MyGroupCard = ({ group }) => {
  const { groupName, memberCount, groupAddress } = group;

  return (
    <div className={styles.groupCard}>
      <h3 className={styles.groupName}>{groupName}</h3>
      <p className={styles.memberCount}>Members: {memberCount.toString()}</p>
      <p className={styles.groupAddress}>Address: {groupAddress}</p>
      <Link href={`/group/${groupAddress}`}>
        <button className={styles.enterGroupButton}>Enter Group</button>
      </Link>
    </div>
  );
};

export default MyGroupCard;


