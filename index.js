import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

window.renderApp = () => {
  const root = ReactDOM.createRoot(document.getElementById("app-root"));
  root.render(<App />);
};
