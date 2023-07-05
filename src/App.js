import "./App.css";
import React from "react";
import * as jose from "jose";
import {
  getRows,
  getAllSchemas,
  getAllTablesInSchema,
  getProjects,
  uniqueEmail,
  insertUser,
  uniqueUsername,
  login,
  getUsername,
} from "./services/services";
import { TableEditor } from "./components/table_editor";
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

  const fetchProjects = async (token = jwt) => {
    try {
      const response = await getProjects(token);
      setProjects(response.data);
    } catch (error) {
      console.log("unable to fetch projects", error);
    }
  };

  const getTables = async (url, schema = "public") => {
    try {
      const response = await getAllTablesInSchema(url, schema, jwt);
      setTables(response.data.map((tableObj) => tableObj.table_name));
    } catch (error) {
      console.log("Unable to fetch tables", error);
    }
  };

  const getSchemas = async (url) => {
    try {
      const response = await getAllSchemas(url, jwt);
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
    getSchemas(project.ip);
    getTables(project.ip);
  };

  const handleCreateNewProject = () => {
    //
  };

  // handling user login return login response data to handle input error on the form.
  // also grabs the username if login successful

  const handleLogin = async (credentials) => {
    try {
      const { data } = await login(credentials);
      if (data) {
        setJWT(data.token);
        const response = await getUsername(credentials, data.token);
        setUsername(response.data);
        fetchProjects(data.token);
        navigate("/dashboard");
        return data;
      } else {
        return data;
      }
    } catch (error) {
      console.log("unable to login", error);
    }
  };

  // handling new user signup

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
          <Route path="tables/:table" element={<TableEditor rows={rows} />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
