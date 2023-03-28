import React, { useContext } from 'react';

import CreateGroupForm from '@/components/CreateGroupForm';
import { VoteAppContext } from '@/context/VoteGroup';

const CreateGroup = () => {
  const { createGroup } = useContext(VoteAppContext);

  return (
    <div>
      <h1>Create Group</h1>
      <CreateGroupForm createGroup={createGroup}></CreateGroupForm>
    </div>
  );
};

export default CreateGroup;

