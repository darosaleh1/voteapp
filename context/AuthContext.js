import { ethers } from 'ethers';
import React, {useState, useEffect} from 'react';



export const AuthContext = React.createContext();

export const AuthProvider = ({children}) => {
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

  const isValidAddress = (address) => {
    return ethers.utils.isAddress(address) && address !== ethers.constants.AddressZero;
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
  
  return (
    <AuthContext.Provider value={{connectWallet, currentAccount, logout, isValidAddress}}>
      {children}
    </AuthContext.Provider>
  )
};

export default AuthProvider