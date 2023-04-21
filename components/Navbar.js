import React, { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faHome } from '@fortawesome/free-solid-svg-icons';
import styles from './Navbar.module.css';
import { useRouter } from 'next/router';

const Navbar = () => {
  const { currentAccount } = useContext(AuthContext);
  const router = useRouter();

  const goToCreateGroupPage = () => {
    router.push('/create-group');
  };

  const goToHomePage = () => {
    router.push('/home');
  };

  const goToGroupsPage = () => {
    router.push('/browse-groups');
  };

  return (
    <div className={styles.navbar}>
      <button className={styles.homeButton} onClick={goToHomePage}>
        <FontAwesomeIcon icon={faHome} />
      </button>
      <div className={styles.navButtons}>
        {currentAccount && (
          <>
            <button className={styles.createGroupButton} onClick={goToGroupsPage}>
              Browse Groups
            </button>
            <button className={styles.createGroupButton} onClick={goToCreateGroupPage}>
              <FontAwesomeIcon icon={faPlus} />
              Create Group
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;


