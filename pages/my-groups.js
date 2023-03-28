import React, { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import GroupFactory from '@/artifacts/contracts/GroupFactory.sol/GroupFactory.json';
import Group from '@/artifacts/contracts/Group.sol/Group.json';
import MyGroups from '@/components/MyGroups';

const MyGroupsPage = () => {
    return (
      <div>
        <h1>My Groups Page</h1>
        <MyGroups />
      </div>
    );
  };

  export default MyGroupsPage;
