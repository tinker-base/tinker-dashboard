import { SchemaSelect } from "./schema_select";
import { TableButton } from "./table_button";
import { Link } from "react-router-dom";

export const Tables = ({ schemas, tables, onClick }) => {
  return (
    <>
      <Link to={"/"} className="block">
        <button className="leading-3 rounded-md bg-indigo-400 px-3.5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-indigo-200">
          All Projects
        </button>
      </Link>
      {/* <label
        id="listbox-label"
        className="block text-sm font-medium leading-3 text-gray-900 pt-3 pb-1"
      >
        Schemas
      </label> */}
      <SchemaSelect schemas={schemas} />
      {/* <select className="p-1 border-solid border-2 rounded-sm">
        {schemas.map((schemaTitle) => (
          <option key={schemaTitle}>{schemaTitle}</option>
        ))}
      </select> */}
      <div className="my-10"></div>
      <ul className="flex flex-col gap-y-4">
        {tables.map((tableName) => (
          <TableButton key={tableName} title={tableName} onClick={onClick} />
        ))}
      </ul>
    </>
  );
};
