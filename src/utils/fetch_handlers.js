import React from "react";
import * as jose from "jose";
import {
  getRows,
  getAllSchemas,
  getAllTablesInSchema,
  fetchAllProjects,
  uniqueEmail,
  insertUser,
  uniqueUsername,
  login,
  getUsername,
  getColumns,
  createNewTable,
  deleteTable,
  getColumnConstraints,
  insertInTable,
  updateRowInTable,
  deleteRow,
  addNewColumn,
  addForeignKey,
  createSchema,
  editTable,
  addTableDescription,
  viewTableDescription,
  updateTableDescription,
} from "../services/services";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../states/login";
import { ProjectDataContext } from "../states/project_details";

export const FunctionContexts = React.createContext();

export const FunctionsShared = ({ children }) => {
  const navigate = useNavigate();

  const { setLogin } = React.useContext(LoginContext);
  const { jwt, setJWT, projectURL, setProjectURL } =
    React.useContext(ProjectDataContext);

  const [username, setUsername] = React.useState("");
  const [projects, setProjects] = React.useState([]);
  const [tables, setTables] = React.useState([]);
  const [schemas, setSchemas] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [selectedSchema, setSelectedSchema] = React.useState("public");
  // const [selectedEditTable, setSelectedEditTable] = React.useState("");
  const [selectedTable, setSelectedTable] = React.useState("");
  const [tableDescription, setTableDescription] = React.useState("");

  const getProjects = async (token = jwt) => {
    try {
      const response = await fetchAllProjects(token);
      setProjects(response.data);
    } catch (error) {
      console.log("unable to fetch projects", error);
    }
  };

  const getTables = async (url, schema = selectedSchema, localStorageJWT) => {
    try {
      const response = await getAllTablesInSchema(
        url,
        schema,
        localStorageJWT || jwt
      );
      setTables(response.data.map((tableObj) => tableObj.table_name));
    } catch (error) {
      console.log("Unable to fetch tables", error);
    }
  };

  const getSchemas = async (url, localStorageJWT) => {
    try {
      const response = await getAllSchemas(url, localStorageJWT || jwt);
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

  const getTableRows = async (tableTitle, localStorageURL, localStorageJWT) => {
    try {
      const columns = await getColumns(
        localStorageURL || projectURL,
        selectedSchema,
        tableTitle,
        localStorageJWT || jwt
      );
      setColumns(columns.data);
      const response = await getRows(
        localStorageURL || projectURL,
        selectedSchema,
        tableTitle,
        localStorageJWT || jwt
      );
      setRows(response.data);
    } catch (error) {
      console.log("unable to get rows from table");
    }
  };

  const handleProjectSelect = (project) => {
    setProjectURL(project.ip);
    getSchemas(project.ip);
    getTables(project.ip);
    sessionStorage.setItem("projectIP", project.ip);
  };

  const handleLogin = async (credentials) => {
    try {
      const { data } = await login(credentials);
      if (data.token) {
        setLogin(true);
        setJWT(data.token);
        const response = await getUsername(credentials, data.token);
        setUsername(response.data);
        sessionStorage.setItem("token", data.token);
        getProjects(data.token);
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

  const handleProjectRefresh = async () => {
    await getProjects();
    navigate("dashboard/projects");
  };

  const handleCreateNewTable = async (formData) => {
    try {
      const response = await createNewTable(formData, projectURL, jwt);

      if (response.data) {
        getTables(projectURL);
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTable = async (tableName) => {
    try {
      const response = await deleteTable(
        selectedSchema,
        tableName,
        projectURL,
        jwt
      );
      if (response.data === true) {
        getTables(projectURL);
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const insertRowInTable = async (tableName, rowData) => {
    await insertInTable(projectURL, selectedSchema, tableName, rowData, jwt);
    await getTableRows(tableName);
  };

  const columnConstraintsForTable = async (tableName) => {
    try {
      const response = await getColumnConstraints(
        projectURL,
        selectedSchema,
        tableName,
        jwt
      );
      return response;
    } catch (e) {
      console.log("Error: Could not display table constraints");
    }
  };

  const editRowInTable = async (tableName, rowData, pk) => {
    await updateRowInTable(
      projectURL,
      selectedSchema,
      tableName,
      rowData,
      pk,
      jwt
    );
    await getTableRows(tableName);
  };

  const deleteRowInTable = async (tableName, pk) => {
    await deleteRow(projectURL, selectedSchema, tableName, pk, jwt);
    await getTableRows(tableName);
  };

  const handleAddColumns = async (formData) => {
    try {
      const { data } = await addNewColumn(formData, projectURL, jwt);

      if (data === true) {
        const colRes = await getColumns(
          projectURL,
          selectedSchema,
          formData.table_name,
          jwt
        );
        setColumns(colRes.data);
        const rowRes = await getRows(
          projectURL,
          selectedSchema,
          formData.table_name,
          jwt
        );
        setRows(rowRes.data);
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddForeignKey = async (formData) => {
    try {
      const { data } = await addForeignKey(formData, projectURL, jwt);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddNewSchema = async (formData) => {
    try {
      const { data } = await createSchema(formData, projectURL, jwt);
      if (data) {
        await getSchemas(projectURL, jwt);
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditTable = async (formData) => {
    try {
      const { data } = await editTable(formData, projectURL, jwt);
      if (data) {
        await getTables(projectURL, selectedSchema);
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTableDescription = async (formData) => {
    try {
      const { data } = await addTableDescription(formData, projectURL, jwt);
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const getTableDescription = async (schema, tableName) => {
    const formData = { p_schema_name: schema, p_table_name: tableName };
    try {
      const { data } = await viewTableDescription(formData, projectURL, jwt);
      setTableDescription(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const editTableDescription = async (formData) => {
    try {
      const { data } = await updateTableDescription(formData, projectURL, jwt);
      getTableDescription(selectedSchema, selectedTable);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FunctionContexts.Provider
      value={{
        jwt,
        setJWT,
        projects,
        setProjects,
        projectURL,
        setProjectURL,
        selectedSchema,
        setSelectedSchema,
        tables,
        setTables,
        schemas,
        setSchemas,
        rows,
        setRows,
        columns,
        setColumns,
        getProjects,
        getTables,
        getSchemas,
        getTableRows,
        handleProjectSelect,
        handleLogin,
        handleSignup,
        handleProjectRefresh,
        handleCreateNewTable,
        handleDeleteTable,
        insertRowInTable,
        columnConstraintsForTable,
        editRowInTable,
        deleteRowInTable,
        handleAddColumns,
        handleAddForeignKey,
        handleAddNewSchema,
        handleEditTable,
        selectedTable,
        setSelectedTable,
        handleAddTableDescription,
        tableDescription,
        setTableDescription,
        getTableDescription,
        editTableDescription,
      }}
    >
      {children}
    </FunctionContexts.Provider>
  );
};
