import { ethers } from 'ethers';
import React, {useState, useEffect} from 'react';
import { pollABI, pollAddress  } from './config';
import GroupFactory from "@/artifacts/contracts/GroupFactory.sol/GroupFactory.json"
import Group from "@/artifacts/contracts/Group.sol/Group.json"



export const VoteAppContext = React.createContext();

export const VoteAppProvider = ({children}) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [error, setError] = useState('');
  
  // CHECK IF USER IS CONNECTED

  const checkIfConnected = async () => {
    if (!window.ethereum) {
      setError("Please Install Metamask");
      return;
    }
  
    const account = window.ethereum.selectedAddress;
  
    if (account) {
      setCurrentAccount(account);
    } else {
      setError("Please connect your MetaMask wallet");
    }
  };
  

  // CONNECT WALLET

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError("Please Install Metamask");
        return;
      }
  
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      setError("Error connecting to MetaMask");
    }
  };

  // LOGOUT

  const logout = () => {
    setCurrentAccount('');
  };

  useEffect(() => {
    const savedAccount = localStorage.getItem('currentAccount');
    if (savedAccount) {
      setCurrentAccount(savedAccount);
    }
  }, []);
  
  useEffect(() => {
    if (currentAccount) {
      localStorage.setItem('currentAccount', currentAccount);
    } else {
      localStorage.removeItem('currentAccount');
    }
  }, [currentAccount]);

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // The user disconnected their account or locked their wallet
          setCurrentAccount('');
        } else {
          // The user connected a new account
          setCurrentAccount(accounts[0]);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        // Clean up the event listener when the component unmounts
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  useEffect(() => {
    if (currentAccount) {
      localStorage.setItem('currentAccount', currentAccount);
    } else {
      localStorage.removeItem('currentAccount');
    }
  }, [currentAccount]);
  
  // USE GROUP FACTORY

  // const groupFactoryAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";

  return (
    <VoteAppContext.Provider value={{connectWallet, currentAccount, logout}}>
      {children}
    </VoteAppContext.Provider>
  )
};

export default VoteAppProvider