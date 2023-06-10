import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import "antd/dist/antd.min.css";

console.log("process: ", process);
console.log("process.env: ", process.env);
console.log("process.env.NODE_ENV: ", process.env.NODE_ENV);

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
