import React from "react";
import ReactDOM from "react-dom";

import App from "./Components/App";
import Admin from "./Components/Admin";

let isAdmin = window.location.search.includes("admin");

ReactDOM.render(
  <div>{isAdmin ? <Admin /> : <App />}</div>,
  document.getElementById("root")
);
