import { Link } from "react-router-dom";
import React from "react";

export const Projects = ({ projects, onSelectProject }) => {
  return (
    <div className="pl-10">
      <h3 className="font-bold text-lg text-indigo-900">
        Your Current Projects
      </h3>
      <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
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
