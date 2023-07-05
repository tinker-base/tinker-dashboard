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

  // grabs all the projects in the admin db to be displayed in the dashboard upon login.

  const fetchProjects = async (token = jwt) => {
    try {
      const response = await getProjects(token);
      setProjects(response.data);
    } catch (error) {
      console.log("unable to fetch projects", error);
    }
  };

  // gets all the tables in the selected schema (public by default) to be displayed in the dashboard
  const getTables = async (url, schema = "public") => {
    try {
      const response = await getAllTablesInSchema(url, schema, jwt);
      setTables(response.data.map((tableObj) => tableObj.table_name));
    } catch (error) {
      console.log("Unable to fetch tables", error);
    }
  };

  // gets all the schemas to be displayed in the select options when a project is selected

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

  // gets all the rows in the selected table (no pagination currently) to be displayed in the table editor

  const getTableRows = async (tableTitle) => {
    try {
      const response = await getRows(projectURL, tableTitle, jwt);
      setRows(response.data);
    } catch (error) {
      console.log("unable to get rows from table");
    }
  };

  // method called when a user selects a project in the dashboard
  // the project URL is set in state
  // grabs all the available schemas in the selected project
  // grabs all the tables in the default schema, 'public'

  const handleProjectSelect = (project) => {
    setProjectURL(project.ip);
    getSchemas(project.ip);
    getTables(project.ip);
  };

  const handleCreateNewProject = () => {
    //
  };

  // handling user login return login response data to handle input error on the form.
  // also grabs and stores in state the username if login successful

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
  // takes the given secret and creates a JWT and to authenticate the user
  // checks username and email are unique
  // assigns the signup user as an admin role in PostgreSQL

  const handleSignup = async ({
    email,
    password,
    username,
    jwtSecret,
    role,
  }) => {
    // jose package is used to create a JWT
    const secret = new TextEncoder().encode(jwtSecret);

    const alg = "HS256";

    // the role of the signed up user is set here
    const jwt = await new jose.SignJWT({ role: "admin" })
      .setProtectedHeader({ alg })
      .sign(secret);

    try {
      // the signing up users entered email and username are checked for uniqueness
      // before inserting the new user into the users table

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
