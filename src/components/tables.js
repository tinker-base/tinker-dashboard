import React from "react";
import { SchemaSelect } from "./schema_select";
import { Link, useParams } from "react-router-dom";
import {
  Cog6ToothIcon,
  HomeIcon,
  TableCellsIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Tables = ({ schemas, tables, onTableSelect }) => {
  const { table } = useParams();

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

      <div className="flex text-white pb-6 justify-between">
        <div className="flex gap-x-2">
          <TableCellsIcon
            className={
              "text-indigo-200 group-hover:text-white h-6 w-6 shrink-0"
            }
            aria-hidden="true"
          />
          <p className="">Tables</p>
        </div>
        <PlusIcon
          className="h-6 w-6 shrink-0 text-indigo-200 hover:bg-indigo-700 border rounded-full border-indigo-200 hover:text-white hover:border-white"
          onClick={() => {
            console.log("add table");
          }}
          aria-hidden="true"
        />
      </div>
      <div className="overflow-auto">
        <ul className="flex flex-col gap-y-1">
          {tables.map((tableName) => (
            <li key={tableName} onClick={() => onTableSelect(tableName)}>
              <Link
                to={`tables/${tableName}`}
                className={classNames(
                  `text-indigo-200 hover:text-white hover:bg-indigo-700 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold`,
                  table === tableName ? "text-white bg-indigo-700" : ""
                )}
              >
                {tableName}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto">
        <Link
          to="/dashboard"
          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
        >
          <Cog6ToothIcon
            className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
            aria-hidden="true"
          />
          Settings
        </Link>
      </div>
    </>
  );
};
