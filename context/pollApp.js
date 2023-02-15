    import  React, { useState, useEffect, useContext} from 'react';
    import Web3Modal from 'web3modal';
    import { ethers } from 'ethers';

    // internal import

    import {pollAddress, pollABI} from "./config"

    const fetchContract = (signerOrProvider)=>
        new ethers.Contract(pollAddress, pollABI, signerOrProvider);

        export const pollContext = React.createContext();

        export const pollProvider = ({children}) => {
            const [CurrentAccount, setCurrentAccount] = useState("");
            const [error, setError] = useState('');
            const [allPoll, setAllPoll] = useState([]);
            const [myPoll, setPoll] = useState([]);
            
            const [allAddress, setAllAddress] = useState([]);

            //--------CONNECTING METAMASK

            const checkIfWalletIsConnected = async()=> {
                if(!window.ethereum) return setError("please install metamask")

                const account = await window.ethereum.request({method: "eth_accounts"});

                if(account.length){
                    setCurrentAccount(account[0]);
                    console.log(account[0]);
                } else {
                    setError("Please Install MetaMask & connect, reload");
                }
            };

            // useEffect(()=> {
            //     checkIfWalletIsConnected();
            // }, []);

            return(
                <pollContext.Provider value={{checkIfWalletIsConnected}}>
                    {children}
                </pollContext.Provider>
            );
        }   