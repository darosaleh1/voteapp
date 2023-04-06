import  {AuthProvider} from "@/context/AuthContext";
import { GroupProvider } from "@/context/GroupContext";
import { PollProvider } from "@/context/PollContext";
import React from "react";
import '../styles/globals.css';
import Navbar from '../components/Navbar';



const App = ({ Component, pageProps }) => (
  <AuthProvider>
    <GroupProvider>
      <PollProvider>
  <div>
    <Navbar />
      <Component {...pageProps} />
  </div>
  </PollProvider>
  </GroupProvider>
  </AuthProvider>

);

export default App;
