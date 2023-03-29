// components/Navbar.js
import React, { useContext } from 'react';
import styles from './Navbar.module.css';
import { VoteAppContext } from '@/context/VoteContext';

const Navbar = () => {
  const { currentAccount, connectWallet, logout } = useContext(VoteAppContext);

  const handleLogout = () => {
    // Clear the current account
    connectWallet('');
  };

  return (
    <div className={styles.navbar}>
      {currentAccount && (
        <button className={styles.logoutButton} onClick={logout}>
          Logout
        </button>
      )}
    </div>
  );
};

export default Navbar;
