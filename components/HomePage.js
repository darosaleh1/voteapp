import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { VoteAppContext } from '@/context/VoteContext';

const HomePage = () => {
  const router = useRouter();
  const { currentAccount } = useContext(VoteAppContext);

  useEffect(() => {
    if (!currentAccount) {
      router.push('/');
    }
  }, [currentAccount, router]);

  return (
    <h1>Welcome to the home page</h1>
  )
};

export default HomePage;