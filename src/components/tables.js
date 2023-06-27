// import { SchemaSelect } from "./schema_select";
import { TableButton } from "./table_button";

export const Tables = ({ schemas, tables, onClick }) => {
  return (
    <aside className="p-3 border-r-2 border-indigo-200">
      {/* <SchemaSelect /> */}
      <div className="p-2">
        <label className="pr-2">Schemas</label>
        <select className="p-1 border-solid border-2 rounded-sm">
          {schemas.map((schemaTitle) => (
            <option key={schemaTitle}>{schemaTitle}</option>
          ))}
        </select>
      </div>
      <div>
        <ul className="flex flex-col gap-y-4">
          {tables.map((tableName) => (
            <TableButton key={tableName} title={tableName} onClick={onClick} />
          ))}
        </ul>
      </div>
    </aside>
  );
};
