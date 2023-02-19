import React, {useState, useEffect} from 'react';
// import Web3Modal from 'web3modal';
// import { ethers } from 'hardhat';
// import { pollAddress, pollABI } from './config';

// const fetchContract = (signerOrProvider) =>
// new ethers.Contract(pollAddress, pollABI, signerOrProvider);

export const PollingContext = React.createContext();

export const PollingProvider = ({children}) => {

  const pollTitle  = 'Polling Smart Contract App'
  return (
    <PollingContext.Provider value={{pollTitle}}>
      {children}
    </PollingContext.Provider>
  )
};


const PollProvider = () => {
  return (
    <div>
        PollContext
    </div>
  )
}

export default PollProvider