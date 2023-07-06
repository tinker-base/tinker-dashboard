import { Link } from "react-router-dom";
import React from "react";
import { SidebarContext } from "../states/sidebar_states";

export const Projects = ({ projects, onSelectProject }) => {
  const { setNewProjectSlideOverOpen } = React.useContext(SidebarContext);
  return (
    <div className="pl-10">
      <ul className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        <li key="newProject" className=" flex rounded-md">
          <button
            className="h-20 w-48 leading-3 rounded-md bg-indigo-300 px-3.5 py-2.5 text-md font-semibold text-gray-900 hover:bg-indigo-100 "
            onClick={() => setNewProjectSlideOverOpen(true)}
          >
            New Project
          </button>
        </li>

        {projects.map((project) => (
          <li key={project.name} className=" flex">
            <Link key={project.name} to={"/dashboard/projects/" + project.name}>
              <button
                className="h-20 w-48 truncate rounded-md border border-gray-200 hover:bg-indigo-100"
                onClick={() => onSelectProject(project)}
              >
                {project.name}
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
