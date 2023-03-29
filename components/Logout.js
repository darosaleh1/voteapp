import React, { useContext } from 'react';
import { VoteAppContext } from '@/context/VoteContext';

const LogoutButton = () => {
  const { logout } = useContext(VoteAppContext);

  return (
    <button onClick={logout}>
      Logout
    </button>
  );
};

export default LogoutButton;
