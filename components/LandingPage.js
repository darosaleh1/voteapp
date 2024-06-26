import React, {useContext, useEffect} from 'react';
import styles from './LandingPage.module.css';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/router';
  

const LandingPage = () => {
    const {connectWallet, currentAccount} = useContext(AuthContext)
    const router = useRouter();

    useEffect(() => {
        if (currentAccount) {
            router.push('/home');
          }
        }, [currentAccount, router]);
    


  return (
    <div className={styles.landingPage}>
      <h1 className={styles.landingPageTitle}>The #1 social voting blockchain app</h1>
      <button className={styles.connectWalletButton} onClick={connectWallet}>
        Connect Wallet
      </button>
    </div>
  );
};

export default LandingPage;
