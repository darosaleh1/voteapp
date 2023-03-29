// components/Navbar.js
import React, { useContext } from 'react';
import { VoteAppContext } from '@/context/VoteContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { currentAccount, connectWallet } = useContext(VoteAppContext);

  const handleLogout = () => {
    // Clear the current account
    connectWallet('');
  };

  return (
    <div className={styles.navbar}>
      {currentAccount && (
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  );
};

export default Navbar;

