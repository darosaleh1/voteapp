import { ethers } from 'ethers';
import React, {useState, useEffect} from 'react';
import { pollABI, pollAddress  } from './config';
import useGroupFactory from "../hooks/useGroupFactory";
import GroupFactory from "@/artifacts/contracts/GroupFactory.sol/GroupFactory.json"
import Group from "@/artifacts/contracts/Group.sol/Group.json"



export const VoteAppContext = React.createContext();

export const VoteAppProvider = ({children}) => {
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

  // USE GROUP FACTORY

  const groupFactoryAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";

  const { groupFactory, createGroup, getDeployedGroups } = useGroupFactory(groupFactoryAddress);

  // JOIN GROUP

  const joinGroup = async (groupAddress, password) => {
    if (!groupAddress) return;
  
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const groupContract = new ethers.Contract(groupAddress, Group.abi, signer);
  
    // You can now use the groupContract instance to interact with the group at the given address
  };
  

// FETCH GROUPS
// const getMyGroups = async () => {
//   if (!currentAccount) return [];

//   // 1. Get the user's current account (already in currentAccount variable)

//   // 2. Fetch all deployed groups using the GroupFactory contract
//   const provider = new ethers.providers.Web3Provider(window.ethereum);
//   const groupFactoryContract = new ethers.Contract(groupFactoryAddress, GroupFactory.abi, provider);
//   const groupAddresses = await groupFactoryContract.getDeployedGroups();

//   // 3. For each group, check if the user is a member using the Group contract
//   const fetchedGroups = await Promise.all(
//     groupAddresses.map(async (address) => {
//       const groupContract = new ethers.Contract(address, Group.abi, provider);
//       const [groupName, isPrivate] = await groupContract.getGroupDetails();
//       return { address, groupName, isPrivate };
//     })
//   );
//   console.log("fetchedGroups:", fetchedGroups);


//   const userGroups = await Promise.all(
//     fetchedGroups.map(async (group) => {
//       const groupContract = new ethers.Contract(group.address, Group.abi, provider);
//       const isMember = await groupContract.members(currentAccount);
//       console.log("isMember:", isMember);
//       return isMember ? group : null;
//     })
//   );

//   // 4. Return the list of groups where the user is a member
//   return userGroups.filter((group) => group !== null);
// };

  // CREATE POLL

  const createPoll = async()=>{
    if (typeof window.ethereum !== "undefined") {
      let contractAddress = pollAddress
      const abi = pollABI
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer)
      const result = await contract.displayDeadline();
      console.log(result);

    }
  }

  const pollTitle  = 'Polling Smart Contract App'
  return (
    <VoteAppContext.Provider value={{pollTitle, checkIfConnected, connectWallet, createPoll, createGroup, getDeployedGroups }}>
      {children}
    </VoteAppContext.Provider>
  )
};


const VoteGroup = () => {
  return (
    <div>
        VoteAppContext
    </div>
  )
}

export default VoteGroup