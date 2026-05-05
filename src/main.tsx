import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { debugLog, initDebugFromUrl, setDebugActive } from "./lib/debug";

const debug = initDebugFromUrl();
setDebugActive(debug);
if (debug) {
  console.log(
    "%cgeolater%c Debug-Mode aktiv. Setze ?debug=0 in der URL um ihn zu deaktivieren.",
    "color:#fff;background:#0ea5e9;padding:2px 6px;border-radius:4px;font-weight:bold",
    "color:inherit",
  );
  debugLog("App startet", { url: window.location.href, time: new Date().toISOString() });
}

const rootEl = document.getElementById("root");
if (rootEl === null) {
  throw new Error("Element #root nicht gefunden");
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
