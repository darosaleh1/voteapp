import { useState, useCallback, useContext } from 'react';
import { useRouter } from 'next/router';
import { GroupContext } from '@/context/GroupContext';

const useLeaveGroup = (groupAddress) => {
  const router = useRouter();
  const { leaveGroup } = useContext(GroupContext);
  const [leavingGroup, setLeavingGroup] = useState(false);

  const handleLeaveGroup = useCallback(async () => {
    try {
      setLeavingGroup(true);
      await leaveGroup(groupAddress);
      router.push('/');
    } catch (error) {
      console.error("Error leaving the group:", error);
      setLeavingGroup(false);
    }
  }, [groupAddress, router, leaveGroup]);

  return { leavingGroup, handleLeaveGroup };
};

export default useLeaveGroup;
