import { VoteAppProvider } from "@/context/VoteGroup";
import React from "react";
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Sidebar from "@/components/Sidebar";



const App = ({ Component, pageProps }) => (
  <VoteAppProvider>
  <div>
    <Navbar />
    <Sidebar />
      <Component {...pageProps} />
  </div>
  </VoteAppProvider>

);

export default App;
