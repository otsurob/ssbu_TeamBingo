import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { Toaster } from "./components/ui/toaster";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <Toaster />
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
