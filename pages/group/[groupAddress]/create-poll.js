import React from 'react';
import { useRouter } from 'next/router';
import CreatePoll from '@/components/CreatePoll';
import GroupLayout from '@/components/GroupLayout';

const CreatePollPage = () => {
  const router = useRouter();
  const { groupAddress } = router.query;

  return (
    <GroupLayout>
      <CreatePoll />
    </GroupLayout>
  );
};

export default CreatePollPage;


