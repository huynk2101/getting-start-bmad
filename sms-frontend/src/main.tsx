import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";
import { DemoDataProvider } from "./mock/store.js";
import { ToastProvider } from "./components/index.js";
import "./tokens.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DemoDataProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </DemoDataProvider>
  </StrictMode>
);
