// components/Navbar.js
import React, { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import styles from './Navbar.module.css';
import { useRouter } from 'next/router';
import { faPlus, faHome } from '@fortawesome/free-solid-svg-icons';



const Navbar = () => {
  const { currentAccount, logout } = useContext(AuthContext);
  const router = useRouter();

  const goToCreateGroupPage = () => {
    router.push('/create-group');
  };

 

  return (
    <div className={styles.navbar}>
      {currentAccount && (
        <>
          <button className={styles.createGroupButton} onClick ={goToCreateGroupPage}>
            <FontAwesomeIcon icon={faPlus} />
            Create Group
          </button>
          <button className={styles.logoutButton} onClick={logout}>
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default Navbar;

