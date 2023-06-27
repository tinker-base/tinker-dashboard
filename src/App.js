import "./App.css";
import React from "react";

import {
  getRows,
  getAllSchemas,
  getAllTablesInSchema,
} from "./services/services";
import { TableEditor } from "./components/table_editor";

function App() {
  const [tables, setTables] = React.useState([]);
  const [schemas, setSchemas] = React.useState([]);
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await getAllTablesInSchema("public");
        setTables(response.data.map((tableObj) => tableObj.table_name));
      } catch (e) {
        console.log("Unable to fetch tables");
      }
    };
    const fetchSchemas = async () => {
      try {
        const response = await getAllSchemas();
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
      } catch (e) {
        console.log("Unable to fetch schemas");
      }
    };

    fetchTables();
    fetchSchemas();
  }, []);

  const handleGetTableRows = async (tableTitle) => {
    try {
      const response = await getRows(tableTitle);
      setRows(response.data);
    } catch (error) {
      console.log("unable to get rows from table");
    }
  };

  return (
    <div className="p-4 h-screen w-screen fixed">
      <div className="font-sans h-full px-2 border-solid rounded-sm border-2 border-indigo-800 shadow-lg shadow-indigo-400">
        <header className="border-b-2 py-2 border-indigo-200">
          <h1 className="font-semibold text-3xl text-indigo-800">Tinker</h1>
        </header>

        <TableEditor
          schemas={schemas}
          tables={tables}
          rows={rows}
          onClick={handleGetTableRows}
        />
      </div>
    </div>
  );
}

export default App;
