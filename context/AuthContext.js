import { ethers } from 'ethers';
import React, { useState, useEffect, useCallback } from 'react';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask not found, please install it from metamask.io');
      }
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
    }
  }, []);

  useEffect(() => {
    if (provider) {
      const signer = provider.getSigner();
      setSigner(signer);
    }
  }, [provider]);
  

  

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError('Please Install Metamask');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      setError('Error connecting to MetaMask');
    }
  };

  const isValidAddress = (address) => {
    return ethers.utils.isAddress(address) && address !== ethers.constants.AddressZero;
  };

  const handleAccountsChanged = useCallback((accounts) => {
    if (accounts.length === 0) {
      setCurrentAccount('');
    } else {
      setCurrentAccount(accounts[0]);
    }
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [handleAccountsChanged]);

  

  return (
    <AuthContext.Provider value={{ connectWallet, currentAccount, provider, signer, }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
