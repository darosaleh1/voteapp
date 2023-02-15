  import Head from 'next/head'
  import Image from 'next/image'
  import React, {useState, useEffect, useContext} from 'react'
  // import {MdVerified}


  // Internal Import
  import { pollContext } from '@/context/pollApp'


  const Home = () => {
    const { checkIfWalletIsConnected } = useContext(pollContext);

    useEffect(() => {
            checkIfWalletIsConnected();
        }, []);

    return <div>Home</div>;
  };

  export default Home;