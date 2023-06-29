import "./App.css";
import React from "react";
import {
  getRows,
  getAllSchemas,
  getAllTablesInSchema,
  getProjects,
  getUser,
  uniqueEmail,
  insertUser,
  uniqueUsername,
} from "./services/services";
// import { TableEditor } from "./components/table_editor";
import { Tables } from "./components/tables";
import { Rows } from "./components/rows";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Projects } from "./components/projects";
import { Dashboard } from "./components/dashboard";
import { Login } from "./components/login";
import { Signup } from "./components/signup";

function App() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [projects, setProjects] = React.useState([]);
  const [projectURL, setProjectURL] = React.useState("");
  const [tables, setTables] = React.useState([]);
  const [schemas, setSchemas] = React.useState([]);
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects();
        setProjects(response.data);
      } catch (error) {
        console.log("unable to fetch projects", error);
      }
    };
    fetchProjects();
  }, []);

  const getTables = async (schema) => {
    try {
      const response = await getAllTablesInSchema(projectURL, schema);
      setTables(response.data.map((tableObj) => tableObj.table_name));
    } catch (error) {
      console.log("Unable to fetch tables", error);
    }
  };

  const getSchemas = async () => {
    try {
      const response = await getAllSchemas(projectURL);
      setSchemas(
        response.data
          .filter((schemaObj) => {
            const name = schemaObj.schema_name;
            return (
              name !== "pg_toast" &&
              name !== "pg_catalog" &&
              name !== "information_schema"
            );
          })
          .map((schemaObj) => schemaObj.schema_name)
      );
    } catch (error) {
      console.log("Unable to fetch schemas", error);
    }
  };

  const getTableRows = async (tableTitle) => {
    try {
      const response = await getRows(projectURL, tableTitle);
      setRows(response.data);
    } catch (error) {
      console.log("unable to get rows from table");
    }
  };

  const handleProjectSelect = (project) => {
    setProjectURL(project.ip);
    getSchemas(projectURL);
    getTables();
  };

  const handleCreateNewProject = () => {
    //
  };

  const handleLogin = async (credentials) => {
    try {
      const { data } = await getUser(credentials);
      console.log(data);
      if (data) {
        setUsername(data);
        navigate("/dashboard");
        return data;
      } else {
        return data;
      }
    } catch (error) {
      console.log("unable to login", error);
    }
  };

  const handleSignup = async ({
    input_email,
    input_password,
    input_username,
  }) => {
    try {
      const validations = {};
      const emailResponse = await uniqueEmail({ input_email });
      validations.email = emailResponse.data;
      const usernameResponse = await uniqueUsername({ input_username });
      validations.username = usernameResponse.data;

      if (validations.email === true && validations.username === true) {
        const { data } = await insertUser({
          input_email,
          input_password,
          input_username,
        });
        if (data === true) {
          navigate("/login");
        }
      }
      return validations;
    } catch (error) {
      console.log("unable to sign up", error);
      return error;
    }
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login onSubmit={handleLogin} />} />
        <Route path="/signup" element={<Signup onSubmit={handleSignup} />} />
        <Route path="/dashboard" element={<Dashboard username={username} />} />
        <Route path="*" element={<Login onSubmit={handleLogin} />} />
      </Routes>
    </>
    // <div className="p-4 h-screen w-screen fixed">
    //   <div className="font-sans h-full px-2 border-solid rounded-sm border-2 border-indigo-800 shadow-lg shadow-indigo-400">
    //     <header className="border-b-2 py-2 border-indigo-200">
    //       <Link to="/" className="w-min">
    //         <span className="font-semibold text-3xl text-indigo-800 ">
    //           Tinker
    //         </span>
    //       </Link>
    //     </header>
    //     <div className="flex h-5/6">
    //       <aside className="p-3 border-r-2 border-indigo-200 w-40">
    //         <Routes>
    //           <Route
    //             path="/"
    //             element={
    //               <Projects
    //                 projects={projects}
    //                 onSelectProject={handleProjectSelect}
    //                 onNewProject={handleCreateNewProject}
    //               />
    //             }
    //           />
    //           <Route
    //             path="/projects/:project"
    //             element={
    //               <Tables
    //                 schemas={schemas}
    //                 tables={tables}
    //                 onClick={getTableRows}
    //               />
    //             }
    //           />
    //         </Routes>
    //       </aside>
    //       <Routes>
    //         <Route path="/projects/:project" element={<Rows rows={rows} />} />
    //       </Routes>
    //     </div>
    //   </div>
    // </div>
  );
}

export default App;
