import { SchemaSelect } from "./schema_select";
import { Link } from "react-router-dom";
import {
  Cog6ToothIcon,
  HomeIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";

export const Tables = ({ schemas, tables, onTableSelect }) => {
  return (
    <>
      <Link
        to="/dashboard"
        className="text-indigo-100 hover:text-white hover:bg-indigo-700 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
      >
        <HomeIcon
          className={"text-indigo-100 group-hover:text-white h-6 w-6 shrink-0"}
          aria-hidden="true"
        />
        Dashboard
      </Link>
      <div className="border-b-2 border-indigo-100 pb-4"></div>
      <SchemaSelect schemas={schemas} />
      <div className="border-b-2 border-indigo-100 my-6"></div>

      <div className="flex gap-x-3 text-white pb-6">
        <TableCellsIcon
          className={"text-indigo-200 group-hover:text-white h-6 w-6 shrink-0"}
          aria-hidden="true"
        />
        <p>Tables</p>
      </div>
      <ul className="flex flex-col gap-y-4">
        {tables.map((tableName) => (
          <li key={tableName} onClick={() => onTableSelect(tableName)}>
            <Link
              to={`tables/${tableName}`}
              className="text-indigo-200 hover:text-white hover:bg-indigo-700 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold active:bg-indigo-700"
            >
              {tableName}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <a
          href="/dashboard"
          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
        >
          <Cog6ToothIcon
            className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
            aria-hidden="true"
          />
          Settings
        </a>
      </div>
    </>
  );
};
