import { createContext, useState } from 'react';

export const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);

  const createGroup = (group) => {
    setGroups((prevGroups) => [...prevGroups, group]);
  };

  return (
    <GroupContext.Provider value={{ groups, createGroup }}>
      {children}
    </GroupContext.Provider>
  );
};
