import { useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/router';
import { GroupContext } from '@/context/GroupContext';
import { AuthContext } from '@/context/AuthContext';

const useGroupDetails = (groupAddress) => {
  const router = useRouter();
  const { getGroupDetails } = useContext(GroupContext);
  const { currentAccount } = useContext(AuthContext);
  const [group, setGroup] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (groupAddress) {
        const groupDetails = await getGroupDetails(groupAddress);
        setGroup(groupDetails);
        setIsOwner(
          groupDetails.groupOwner.toLowerCase() === currentAccount.toLowerCase()
        );
      }
    };

    fetchGroupDetails();
  }, [groupAddress, currentAccount]);

  const handleCreatePoll = useCallback(() => {
    router.push(`/group/${groupAddress}/create-poll`);
  }, [groupAddress, router]);

  return { group, isOwner, handleCreatePoll };
};

export default useGroupDetails;
