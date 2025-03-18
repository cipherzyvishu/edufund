import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Web3Provider } from "./context/Web3Context";
import { ContractProvider } from "./context/ContractContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Web3Provider>
      <ContractProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ContractProvider>
    </Web3Provider>
  </React.StrictMode>
);
