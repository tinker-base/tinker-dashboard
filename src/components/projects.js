import { Link } from "react-router-dom";
import React from "react";

export const Projects = ({ projects, onSelectProject, onRefresh }) => {
  const [rotate, setRotate] = React.useState(false);

  const handleRefreshClick = () => {
    setRotate(true);
    setTimeout(() => {
      setRotate(false);
    }, 500);
    onRefresh();
  };

  return (
    <div className="pl-10">
      <div className="flex content-center">
        <h3 className="font-bold text-lg text-indigo-900 pr-6 self-center">
          Your Current Projects
        </h3>
        <button
          className={`border rounded border-indigo-300 p-2`}
          onClick={handleRefreshClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-6 h-6  
              ${
                rotate
                  ? "transition-transform duration-500 ease-in-out transform rotate-180"
                  : ""
              }
            `}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </button>
      </div>
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
