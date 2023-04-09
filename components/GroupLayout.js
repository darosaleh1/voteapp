// components/GroupLayout.js
import React from 'react';
import Sidebar from '@/components/Sidebar';
import styles from '@/components/GroupLayout.module.css';

const GroupLayout = ({ children, isOwner, onCreatePoll, showCreatePoll }) => {
  return (
    <div className={styles.groupLayout}>
      <Sidebar
        isOwner={isOwner}
        onCreatePoll={onCreatePoll}
        showCreatePoll={showCreatePoll}
      />
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default GroupLayout;
