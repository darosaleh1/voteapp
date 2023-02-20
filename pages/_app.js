import { PollProvider } from "@/context/Poll";
import React from "react";


const App = ({ Component, pageProps }) => (
  <PollProvider>
  <div>
      <Component {...pageProps} />
  </div>
  </PollProvider>

);

export default App;
