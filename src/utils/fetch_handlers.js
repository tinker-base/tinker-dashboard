import React from "react";

export const FunctionContexts = React.createContext();

export const FunctionsShared = ({ children }) => {
  const [jwt, setJWT] = React.useState();
  const [projects, setProjects] = React.useState([]);
  const [projectURL, setProjectURL] = React.useState("");
  const [tables, setTables] = React.useState([]);
  const [schemas, setSchemas] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);

  return (
    <FunctionContexts.Provider
      value={{
        jwt,
        setJWT,
        projects,
        setProjects,
        projectURL,
        setProjectURL,
        tables,
        setTables,
        schemas,
        setSchemas,
        rows,
        setRows,
        columns,
        setColumns,
      }}
    >
      {children}
    </FunctionContexts.Provider>
  );
};
