import  {VoteAppProvider} from "@/context/VoteContext";
import React from "react";
import '../styles/globals.css';
import Navbar from '../components/Navbar';



const App = ({ Component, pageProps }) => (
  <VoteAppProvider>
  <div>
    <Navbar />
      <Component {...pageProps} />
  </div>
  </VoteAppProvider>

);

export default App;
