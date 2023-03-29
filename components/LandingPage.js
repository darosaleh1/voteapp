// components/LandingPage.js
import React, {useContext, useEffect} from 'react';
import styles from './LandingPage.module.css';
import { VoteAppContext } from '@/context/VoteContext';
import { useRouter } from 'next/router';
  

const LandingPage = () => {
    const {connectWallet, checkIfConnected, currentAccount} = useContext(VoteAppContext)
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
