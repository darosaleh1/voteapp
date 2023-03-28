import React, { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import Group from "@/artifacts/contracts/Group.sol/Group.json";

import { VoteAppContext } from "@/context/VoteGroup";

const GroupList = () => {
    const [groups, setGroups] = useState([]);
    const { getDeployedGroups, joinGroup } = useContext(VoteAppContext);
    const [showModal, setShowModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      const groupAddresses = await getDeployedGroups();
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const fetchedGroups = await Promise.all(
        groupAddresses.map(async (address) => {
          const groupContract = new ethers.Contract(address, Group.abi, provider);
          const [groupName, isPrivate] = await groupContract.getGroupDetails();
          return { address, groupName, isPrivate };
        })
      );

      setGroups(fetchedGroups);
    };

    fetchGroups();
  }, [getDeployedGroups]);

  const handleJoinGroup = async (group) => {
    if (group.isPrivate) {
      setSelectedGroup(group);
      setShowModal(true);
    } else {
      await joinGroup(group.address, "");
    }
  };

  const handleJoinPrivateGroup = async () => {
    await joinGroup(selectedGroup.address, password);
    setShowModal(false);
  };

  

  return (
    <div>
      <h2>Groups:</h2>
      <ul>
        {groups.map((group, index) => (
          <li key={index}>
            {group.groupName} ({group.address})
          </li>
        ))}
      </ul>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Enter Password:</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleJoinPrivateGroup}>Join Group</button>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupList;

