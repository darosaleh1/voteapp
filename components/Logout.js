import React, { useContext } from 'react';
import { VoteAppContext } from '@/context/AuthContext';

const LogoutButton = () => {
  const { logout } = useContext(VoteAppContext);

  return (
    <button onClick={logout}>
      Logout
    </button>
  );
};

export default LogoutButton;
