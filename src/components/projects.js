import { Link } from "react-router-dom";

export const Projects = ({ projects, onSelectProject, onNewProject }) => {
  return (
    <>
      <Link className="block ">
        <button
          className="leading-3 rounded-md bg-indigo-400 px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-indigo-00 "
          onClick={onNewProject}
        >
          New Project
        </button>
      </Link>
      <h1>Projects</h1>
      <ul className="flex flex-col gap-y-4 mt-5">
        {projects.map((project) => (
          <Link key={project.name} to={`/projects/${project.name}`}>
            <button
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => onSelectProject(project)}
            >
              {project.name}
            </button>
          </Link>
        ))}
      </ul>
    </>
  );
};
