  import React, {useEffect, useContext, useState} from 'react'
  import GroupList from '@/components/GroupList';
  

  // Internal Import
  import { ethers } from 'ethers';
import { VoteAppContext } from '@/context/VoteGroup';
  
  const index = () => {
    const {pollTitle, checkIfConnected,createPoll, createGroup} = useContext(VoteAppContext)

    useEffect(() => {
      checkIfConnected();
    }, [])
    
    return (
      <div>{pollTitle} <button onClick={createPoll}>Create Poll</button>
      <GroupList />
      </div>
    )
  }
  
  export default index




  // export default function index() {
  //   const [isConnected, setIsConnected] = useState(false);
  //     const [provider, setProvider] = useState();

  //   async function connect() {
  //     if (typeof window.ethereum !== "undefined") {
  //       try{
  //         await ethereum.request({method: "eth_requestAccounts"});
  //         setIsConnected(true);
  //         let connectedProvider = new ethers.providers.Web3Provider(
  //           window.ethereum
  //           );
  //           setSigner(connectedProvider.getSigner())
  //       } catch(e) {
  //         console.log(e);
  //       }
  //     } else {
  //       setIsConnected(false)
  //     }
  //   }

    
    
  //   return (
  //    <div>
  //     Loading...
  //    <button onClick={() => connect()}> Connect! </button>
  //    </div>

  //   )
  // }
  