// components/Sidebar.js
import React from 'react';
import styles from '@/components/Sidebar.module.css';

const Sidebar = ({ isOwner, onCreatePoll, minimized, toggleSidebar }) => {
  const sidebarClasses = minimized ? `${styles.sidebar} ${styles.minimized}` : styles.sidebar;

  return (
    <div className={sidebarClasses}>
      <button onClick={toggleSidebar} className={styles.toggleButton}>
        {minimized ? '>' : '<'}
      </button>
      {isOwner && !minimized && (
        <button onClick={onCreatePoll} className={styles.createPollButton}>
          Create Poll
        </button>
      )}
    </div>
  );
};

export default Sidebar;


