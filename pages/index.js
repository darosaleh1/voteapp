  import React, {useEffect, useContext, useState} from 'react'

  import { PollingContext } from '@/context/pollProvider';

  // Internal Import
  import { ethers } from 'ethers';
  
  const index = () => {
    const {pollTitle} = useContext(PollingContext)
    return (
      <div>{pollTitle}</div>
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
  