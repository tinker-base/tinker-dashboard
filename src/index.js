import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { SidebarStates } from "./states/sidebar_states";
import { LoggedIn } from "./states/login";
import { ShowModalStates } from "./states/show_modals";
import { FunctionsShared } from "./utils/fetch_handlers";
import { ProjectData } from "./states/project_details";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <LoggedIn>
        <ProjectData>
          <FunctionsShared>
            <SidebarStates>
              <ShowModalStates>
                <App />
              </ShowModalStates>
            </SidebarStates>
          </FunctionsShared>
        </ProjectData>
      </LoggedIn>
    </Router>
  </React.StrictMode>
);
