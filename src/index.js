import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { SidebarStates } from "./states/sidebar_states";
import { LoggedIn } from "./states/login";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SidebarStates>
      <LoggedIn>
        <Router>
          <App />
        </Router>
      </LoggedIn>
    </SidebarStates>
  </React.StrictMode>
);
