import React, { useContext } from "react";
import { Outlet, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Tables } from "./sidebars/tables";
import { LoginContext } from "../states/login";
import { ProjectDataContext } from "../states/project_details";
import { ReactComponent as TinkerLogo } from "../images/SVG Vector Files/tinker_logo.svg";
import { AddTableSlideOver } from "./slideovers/add_table";
import { AddRowSlideOver } from "./slideovers/add_row";
import { EditRowSlideOver } from "./slideovers/edit_row";
import { SidebarNav } from "./sidebars/sidebar_nav";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { setLogin } = React.useContext(LoginContext);
  const { setJWT } = useContext(ProjectDataContext);
  const { project } = useParams();

  React.useEffect(() => {
    const token = sessionStorage.getItem("token");
    setJWT(token);

    if (!token) {
      navigate("/login");
    } else {
      setLogin(true);
    }
  }, [navigate, setJWT, setLogin]);

  return (
    <>
      <div>
        <AddTableSlideOver />
        <AddRowSlideOver />
        <EditRowSlideOver />
        {/* Static sidebar for desktop */}
        <div
          id="static-sidebar-wrapper"
          className="fixed inset-y-0 z-50 flex w-48 flex-col"
        >
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div
            id="static-sidebar"
            className="flex flex-col h-full gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4"
          >
            <div className="flex pt-4 pb-2 shrink-0 items-center justify-center gap-2">
              <TinkerLogo className="h-10 w-auto" />
              <h1 className="text-white text-2xl self-end">TINKER</h1>
            </div>
            <nav className="flex flex-1 flex-col">
              {project ? <Tables /> : <SidebarNav />}
            </nav>
          </div>
        </div>

        <div className="pl-48 pt-8">
          <main className="">
            <div className="px-4 ">{<Outlet />}</div>
          </main>
        </div>
      </div>
    </>
  );
};
