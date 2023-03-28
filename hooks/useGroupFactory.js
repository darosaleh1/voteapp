import { useState, useEffect } from "react";
import { ethers } from "ethers";
import GroupFactory from '@/artifacts/contracts/GroupFactory.sol/GroupFactory.json'


const useGroupFactory = (groupFactoryAddress) => {
    const [groupFactory, setGroupFactory] = useState(null);
  
    useEffect(() => {
      if (!groupFactoryAddress || groupFactoryAddress == "")
       return;
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const groupFactoryInstance = new ethers.Contract(
        groupFactoryAddress,
        GroupFactory.abi,
        signer
      );
      console.log("GroupFactory ABI:", GroupFactory.abi);

      if (!groupFactoryAddress) return;


      setGroupFactory(groupFactoryInstance);
    }, [groupFactoryAddress]);
  
    const createGroup = async (
      groupName,
      isGroupPrivate,
      hashedPassword,
      salt
    ) => {
      if (!groupFactory) return;
    
      try {
        const tx = await groupFactory.createGroup(
          groupName,
          isGroupPrivate,
          hashedPassword,
          salt
        );
        const receipt = await tx.wait();
        console.log("Transaction Receipt:", receipt);
      } catch (error) {
        console.error("Error in createGroup function:", error);
      }
    };
    

    const getDeployedGroups = async () => {
      if (!groupFactory) return [];
    
      const groups = await groupFactory.getDeployedGroups();
      return groups;
    };
    
  
    return { groupFactory, createGroup, getDeployedGroups };
  };

export default useGroupFactory;

  