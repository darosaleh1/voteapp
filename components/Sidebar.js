import React, { useState } from 'react';
import styles from '@/components/Sidebar.module.css';
import { useRouter } from 'next/router';

const Sidebar = ({ isOwner, onCreatePoll, showCreatePoll }) => {
  const [minimized, setMinimized] = useState(false);
  const router = useRouter();
  const { groupAddress } = router.query;

  const toggleSidebar = () => {
    setMinimized(!minimized);
  };

  const handleGroupHome = () => {
    router.push(`/group/${groupAddress}`);
  };

  const handlePastPolls = () => {
    router.push(`/group/${groupAddress}/past-polls`);
  };

  const handleManageGroup = () => {
    router.push(`/group/${groupAddress}/manage-group`);

  };

  const sidebarClasses = minimized
    ? `${styles.sidebar} ${styles.minimized}`
    : styles.sidebar;

    return (
      <div className={sidebarClasses}>
        <button onClick={toggleSidebar} className={styles.toggleButton}>
          {minimized ? '>' : '<'}
        </button>
        {!minimized && (
          <div className={styles.buttonGroup}>
            <button onClick={handleGroupHome} className={styles.sidebarButton}>
              Group Home
            </button>
            {isOwner && showCreatePoll && (
              <button onClick={onCreatePoll} className={styles.sidebarButton}>
                Create Poll
              </button>
            )}
            <button onClick={handlePastPolls} className={styles.sidebarButton}>
              Past Polls
            </button>
            {isOwner && (
            <button onClick={handleManageGroup} className={styles.sidebarButton}>
              Manage Group
            </button>
          )}
          </div>
        )}
      </div>
    );    
  };

export default Sidebar;