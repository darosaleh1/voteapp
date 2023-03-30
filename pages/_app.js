import  {AuthProvider} from "@/context/AuthContext";
import { GroupProvider } from "@/context/GroupContext";
import React from "react";
import '../styles/globals.css';
import Navbar from '../components/Navbar';



const App = ({ Component, pageProps }) => (
  <AuthProvider>
    <GroupProvider>
  <div>
    <Navbar />
      <Component {...pageProps} />
  </div>
  </GroupProvider>
  </AuthProvider>

);

export default App;
