import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";
import { DocsApp } from "./DocsApp";
import "./tokens.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <DocsApp />
        <Analytics />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
