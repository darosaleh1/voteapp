import { PollingProvider } from "@/context/pollProvider";
import React from "react";


const App = ({ Component, pageProps }) => (
  <PollingProvider>
  <div>
      <Component {...pageProps} />
  </div>
  </PollingProvider>

);

export default App;
