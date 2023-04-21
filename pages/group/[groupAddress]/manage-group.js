import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GroupContext } from '@/context/GroupContext';

const ManageGroup = () => {
  const { getAllMembers, getGroupOwner, removeMember, transferOwnership } = useContext(GroupContext);
  const [members, setMembers] = useState([]);
  const [owner, setOwner] = useState("");
  const router = useRouter();
  const { groupAddress } = router.query;

  useEffect(() => {
    if (groupAddress) {
      const fetchMembers = async () => {
        const [fetchedMembers, ownerAddress] = await Promise.all([
          getAllMembers(groupAddress),
          getGroupOwner(groupAddress),
        ]);

        setMembers(fetchedMembers.filter((address) => address !== ownerAddress));
        setOwner(ownerAddress);
      };

      fetchMembers();
    }
  }, [groupAddress]);

  const handleRemoveMember = async (memberAddress) => {
    await removeMember(groupAddress, memberAddress, owner);
    setMembers(members.filter((address) => address !== memberAddress));
  };

  const handleTransferOwnership = async (newOwner) => {
    const success = await transferOwnership(groupAddress, newOwner);
    if (success) {
      alert('Ownership has been transferred successfully.');
    } else {
      alert('Error transferring ownership. Please try again.');
    }
  };

  return (
    <div>
      <h1>Manage Group</h1>
      <h2>Members</h2>
      <ul>
        {members.map((memberAddress, index) => (
          <li key={index}>
            {memberAddress}
            <button onClick={() => handleRemoveMember(memberAddress)}>
              Remove Member
            </button>
            <button
              onClick={() => handleTransferOwnership(memberAddress)}
              className="transfer-ownership"
            >
              Transfer Ownership
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
  
};

export default ManageGroup;

