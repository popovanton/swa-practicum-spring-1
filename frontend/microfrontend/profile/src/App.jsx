import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App"
import { BrowserRouter } from "react-router-dom";
import "./index.css";

const rootElement = document.getElementById("app")
if (!rootElement) throw new Error("Failed to find the root element")

const root = ReactDOM.createRoot(rootElement)

root.render(
  <React.StrictMode>
    <BrowserRouter>
    <div className="page__content">
      <App />
    </div>
    </BrowserRouter>
  </React.StrictMode>
);
