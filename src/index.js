import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { SidebarStates } from "./states/sidebar_states";
import { LoggedIn } from "./states/login";
import { ShowModalStates } from "./states/show_modals";
import { FunctionsShared } from "./utils/fetch_handlers";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <FunctionsShared>
      <SidebarStates>
        <ShowModalStates>
          <LoggedIn>
            <Router>
              <App />
            </Router>
          </LoggedIn>
        </ShowModalStates>
      </SidebarStates>
    </FunctionsShared>
  </React.StrictMode>
);
