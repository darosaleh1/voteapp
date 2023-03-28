import React, { useContext, useEffect, useState } from 'react';
import { VoteAppContext } from '@/context/VoteGroup';

const MyGroups = () => {
  const { getMyGroups } = useContext(VoteAppContext);
  const [myGroups, setMyGroups] = useState([]);

  useEffect(() => {
    (async () => {
      const fetchedMyGroups = await getMyGroups();
      setMyGroups(fetchedMyGroups);
    })();
  }, [getMyGroups]);





  return (
    
    <div>
      <h1>My Groups</h1>
      <ul>
        {myGroups.map((group) => (
          <li key={group.address}>{group.groupName}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyGroups;



