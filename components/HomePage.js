import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import MyGroups from './MyGroups';

const HomePage = () => {
  const router = useRouter();
  const { currentAccount } = useContext(AuthContext);

  useEffect(() => {
    if (!currentAccount) {
      router.push('/');
    }
  }, [currentAccount, router]);

  return (
    <div>
    <h1>Welcome to the home page</h1>
    <MyGroups/>
    </div>
  )
};

export default HomePage;