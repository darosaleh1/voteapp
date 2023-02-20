import React, {useState, useEffect} from 'react';
// import Web3Modal from 'web3modal';
// import { ethers } from 'hardhat';
// import { pollAddress, pollABI } from './config';

// const fetchContract = (signerOrProvider) =>
// new ethers.Contract(pollAddress, pollABI, signerOrProvider);

export const PollingContext = React.createContext();

export const PollProvider = ({children}) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [error, setError] = useState('');
  
  // CONNECTING METAMASK

  const checkIfConnected = async()=>{
    if(!window.ethereum) return setError('Please Install Metamask');

    const account = await window.ethereum.request({method: "eth_requestAccounts"});

    if(account.length){
      setCurrentAccount(account[0]);
    } else{
      setError("Please Install Metamask & Connect")
    }
  };

  // CONNECT WALLET

  const connectWallet = async()=>{
    if(!window.ethereum) return setError("Please Install Metamask")

    const account = await window.ethereum.request({method: "eth_requestAccounts"});

    setCurrentAccount(account[0]);



  }

  const pollTitle  = 'Polling Smart Contract App'
  return (
    <PollingContext.Provider value={{pollTitle, checkIfConnected, connectWallet}}>
      {children}
    </PollingContext.Provider>
  )
};


const Poll = () => {
  return (
    <div>
        PollContext
    </div>
  )
}

export default Poll