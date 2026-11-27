import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";
import { DocsApp } from "./DocsApp";
import "./tokens.css";

// Hold the first render until the webfonts are in (max 2s) so text doesn't reflow on font swap.
// The boot loader in index.html stays up meanwhile.
const fontsReady = Promise.race([
  Promise.all([
    document.fonts.load('800 1em Fraunces'),
    document.fonts.load('500 italic 1em Fraunces'),
    document.fonts.load('400 1em "DM Sans"'),
    document.fonts.load('600 1em "DM Sans"'),
    document.fonts.load('500 1em "JetBrains Mono"'),
  ]),
  new Promise((r) => setTimeout(r, 2000)),
]).catch(() => {});

// Keep the loader up for one full enso cycle (2.4s since navigation start) so it reads as intentional, not a flicker.
const MIN_LOADER_MS = 2400;
const minDelay = new Promise((r) => setTimeout(r, Math.max(0, MIN_LOADER_MS - performance.now())));

Promise.all([fontsReady, minDelay]).then(() => ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <DocsApp />
        <Analytics />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
));
