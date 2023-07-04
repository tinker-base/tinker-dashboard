import "./App.css";
import React from "react";
import * as jose from "jose";
import {
  getRows,
  getAllSchemas,
  getAllTablesInSchema,
  getProjects,
  getUser,
  uniqueEmail,
  insertUser,
  uniqueUsername,
  login,
  getUsername,
} from "./services/services";
import { Rows } from "./components/rows";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Projects } from "./components/projects";
import { Dashboard } from "./components/dashboard";
import { Login } from "./components/login";
import { Signup } from "./components/signup";
import { PageNotFound } from "./components/page_not_found";

function App() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [jwt, setJWT] = React.useState();
  const [projects, setProjects] = React.useState([]);
  const [projectURL, setProjectURL] = React.useState("");
  const [tables, setTables] = React.useState([]);
  const [schemas, setSchemas] = React.useState([]);
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects(jwt);
        setProjects(response.data);
      } catch (error) {
        console.log("unable to fetch projects", error);
      }
    };
    fetchProjects();
  }, []);

  const getTables = async (schema) => {
    try {
      const response = await getAllTablesInSchema(projectURL, schema, jwt);
      setTables(response.data.map((tableObj) => tableObj.table_name));
    } catch (error) {
      console.log("Unable to fetch tables", error);
    }
  };

  const getSchemas = async () => {
    try {
      const response = await getAllSchemas(projectURL, jwt);
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
      const response = await getRows(projectURL, tableTitle, jwt);
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
      const { data } = await login(credentials);
      if (data) {
        await setJWT(data.token);
        console.log(jwt);
        const response = await getUsername(credentials, jwt);
        setUsername(response.data);
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
    email,
    password,
    username,
    jwtSecret,
    role,
  }) => {
    const secret = new TextEncoder().encode(jwtSecret);

    const alg = "HS256";

    const jwt = await new jose.SignJWT({ role: "admin" })
      .setProtectedHeader({ alg })
      .sign(secret);

    try {
      const validations = {};
      const emailResponse = await uniqueEmail({ email }, jwt);
      validations.email = emailResponse.data;
      const usernameResponse = await uniqueUsername({ username }, jwt);
      validations.username = usernameResponse.data;

      if (validations.email === true && validations.username === true) {
        const { data } = await insertUser(
          {
            email,
            password,
            username,
            role,
          },
          jwt
        );
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
        <Route index element={<Login onSubmit={handleLogin} />} />
        <Route
          path="login"
          element={<Login onSubmit={handleLogin} setJWT={setJWT} />}
        />
        <Route path="signup" element={<Signup onSubmit={handleSignup} />} />
        <Route path="dashboard" element={<Dashboard username={username} />}>
          <Route
            index
            element={
              <Projects
                projects={projects}
                onSelectProject={handleProjectSelect}
                onNewProject={handleCreateNewProject}
              />
            }
          />
          <Route
            path="projects"
            element={
              <Projects
                projects={projects}
                onSelectProject={handleProjectSelect}
                onNewProject={handleCreateNewProject}
              />
            }
          />
          <Route path="users" element={<h1>Users List</h1>} />
        </Route>
        <Route
          path="dashboard/projects/:project"
          element={
            <Dashboard
              username={username}
              schemas={schemas}
              tables={tables}
              onTableSelect={getTableRows}
            />
          }
        >
          <Route path="tables/:table" element={<Rows rows={rows} />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
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
    // projects={projects}
    // onSelectProject={handleProjectSelect}
    // onNewProject={handleCreateNewProject}
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
