import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App.js";
import { DemoDataProvider } from "./mock/store.js";
import { ToastProvider } from "./components/index.js";
import "./tokens.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <DemoDataProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </DemoDataProvider>
    </BrowserRouter>
  </StrictMode>
);
