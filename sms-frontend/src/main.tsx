import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "./App.js";
import { DemoDataProvider } from "./mock/store.js";
import { ToastProvider } from "./components/index.js";
import "./tokens.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <DemoDataProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </DemoDataProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
