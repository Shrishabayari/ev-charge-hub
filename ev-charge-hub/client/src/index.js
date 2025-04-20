import React from "react";
import ReactDOM from "react-dom/client"; // Correct import for React 18
import "./index.css"; // Make sure you have imported Tailwind CSS
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")); // Create root
root.render( // Use .render() on the root
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
