// React
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// React router dom
import { BrowserRouter } from "react-router-dom";

// CSS
import "./index.css";
// Main App
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
