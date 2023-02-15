import { CreateTheme, NextUIProvider } from "@nextui-org/react"
// import 'sf-font';
import Link from "next/link";
import {Spacer, Button, Col, Row, Container, Dropdown} from "@nextui-org/react"
import react from "react";

// INTERNAL IMPORT

import { pollProvider } from "@/context/pollApp";

const App = ({ Component, pageProps }) => (
  <pollProvider>
    <div>
    <Component {...pageProps} />;
    </div>
  </pollProvider>
);

export default App
