import React from "react";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { SidebarContext } from "../states/sidebar_states";
import { FunctionContexts } from "../utils/fetch_handlers";
import { ToggleAddRowSlideOver } from "../utils/slideover_handlers";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const TableEditor = () => {
  const { setEditRow } = React.useContext(SidebarContext);
  const { setRowData } = React.useContext(SidebarContext);
  const { columns, rows } = React.useContext(FunctionContexts);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="mt-4  sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={ToggleAddRowSlideOver()}
          >
            Add Row
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  {columns.map((column) => {
                    return (
                      <th
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                      >
                        {`${column.col} (${column.data_type})`}
                      </th>
                    );
                  })}
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                  >
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, personIdx) => {
                  return (
                    <tr key={row.id}>
                      {columns.map(({ col }) => {
                        return (
                          <td
                            className={classNames(
                              personIdx !== rows.length - 1
                                ? "border-b border-gray-200"
                                : "",
                              "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                            )}
                          >
                            {String(row[col])}
                          </td>
                        );
                      })}
                      <td
                        className={classNames(
                          personIdx !== rows.length - 1
                            ? "border-b border-gray-200"
                            : "",
                          "relative whitespace-nowrap py-4 pr-2 pl-3 text-right text-sm font-medium"
                        )}
                      >
                        <div className="flex justify-end">
                          <PencilSquareIcon
                            data-id={row.id}
                            className="w-5 h-5 mr-4 cursor-pointer text-indigo-600 hover:text-indigo-900"
                            onClick={(e) => {
                              setRowData(row);
                              setEditRow(true);
                            }}
                          />
                          <TrashIcon
                            className="w-6 h-6 cursor-pointer text-indigo-600 hover:text-indigo-900"
                            onClick={() => {
                              console.log("delete row");
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
