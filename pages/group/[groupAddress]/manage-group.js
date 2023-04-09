import React, { useContext, useEffect, useState } from 'react';
import { GroupContext } from '@/context/GroupContext';

const ManageGroup = () => {
  const { groupOwner, getAllMembers } = useContext(GroupContext);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (groupOwner) {
      const fetchMembers = async () => {
        const fetchedMembers = await getAllMembers(groupOwner);
        setMembers(fetchedMembers);
      };

      fetchMembers();
    }
  }, [groupOwner]);

  return (
    <div>
      <h1>Manage Group</h1>
      <h2>Members</h2>
      <ul>
        {members.map((memberAddress, index) => (
          <li key={index}>{memberAddress}</li>
        ))}
      </ul>
    </div>
  );
};

export default ManageGroup;
