import React from "react";
import { useParams } from "react-router";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { SidebarContext } from "../states/sidebar_states";
import { FunctionContexts } from "../utils/fetch_handlers";
import {
  ToggleAddRowSlideOver,
  ToggleAddColumnSlideOver,
  ToggleEditColumnSlideOver,
} from "../utils/slideover_handlers";
import { ShowModalContext } from "../states/show_modals";
import DeleteRowModal from "./modals/delete_row";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const TableEditor = () => {
  const { table } = useParams();
  const { setEditRow, setRowData, columnConstraints, setColumnConstraints } =
    React.useContext(SidebarContext);
  const {
    columns,
    rows,
    columnConstraintsForTable: getColumnConstraints,
    deleteRowInTable,
    tableDescription,
  } = React.useContext(FunctionContexts);
  const { showDeleteRow, setShowDeleteRow } =
    React.useContext(ShowModalContext);
  const [highlightedRow, setHighlightedRow] = React.useState(0);

  React.useEffect(() => {}, [tableDescription]);
  React.useEffect(() => {
    (async () => {
      try {
        const response = await getColumnConstraints(table);
        if (response) {
          const multipleConstraintsCollapsed = collapseMultipleConstraints(
            response.data
          );
          setColumnConstraints(multipleConstraintsCollapsed);
        }
      } catch (err) {
        console.log("error retrieving table constraints");
      }
    })();
  }, [table, getColumnConstraints, setColumnConstraints]);

  const collapseMultipleConstraints = (constraints) => {
    let seen = {};
    constraints.forEach((constraint) => {
      const name = constraint.column_name;
      let clause = constraint.check_clause
        ? constraint.check_clause
        : constraint.constraint_type;
      if (seen[name]) {
        seen[name].constraint_type.push(clause); ///Assuming it's already an array
      } else {
        seen[name] = constraint;
        if (clause) {
          seen[name].constraint_type = [clause];
        }
      }
    });
    return Object.values(seen);
  };

  const getPrimaryKeyColumn = (columnConstraints) => {
    for (let constraint of columnConstraints) {
      if (
        constraint.constraint_type &&
        constraint.constraint_type.includes("PRIMARY KEY")
      ) {
        return constraint.column_name;
      }
    }
  };

  const createPKObject = (rowData, columnConstraints) => {
    let pkColumn = getPrimaryKeyColumn(columnConstraints);
    let pkValue = rowData[pkColumn];
    return { column: pkColumn, value: pkValue };
  };

  const deleteRow = async (row) => {
    try {
      const pkObject = createPKObject(row, columnConstraints);
      await deleteRowInTable(table, pkObject);
    } catch (error) {
      console.log("Error: Could not delete row.");
    }
  };

  return (
    <>
      <div className="flex w-full p-2 bg-indigo-100">
        <h4 className="text-sm font-semibold pr-2">Table Description:</h4>
        <p className="text-sm self-end">{tableDescription}</p>
      </div>
      <div className="px-8">
        <div className="mt-6 flex items-center gap-x-3">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={ToggleAddRowSlideOver()}
          >
            Add Row
          </button>
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={ToggleAddColumnSlideOver()}
          >
            Add Columns
          </button>
        </div>

        <div className="mt-4 flow-root">
          <div className="-mx-4 -my-2">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr>
                    {columns.map((column) => {
                      return (
                        <th
                          key={column.col}
                          scope="col"
                          className={classNames(
                            !highlightedRow && "sticky top-0 bg-opacity-75",
                            "border-b border-gray-300 bg-white py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                          )}
                        >
                          {`${column.col} (${column.data_type})`}
                        </th>

                        // Toggle func for opening the edit column slideover
                        // onClick={ToggleEditColumnSlideOver()}
                      );
                    })}
                    <th
                      key="noColumn"
                      scope="col"
                      className={classNames(
                        !highlightedRow && "sticky top-0 bg-opacity-75",
                        "border-b border-gray-300 bg-white py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                      )}
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
                              key={`${col}: ${row[col]}`}
                              className={classNames(
                                personIdx !== rows.length - 1
                                  ? "border-b border-gray-200"
                                  : "",
                                "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8",
                                highlightedRow === row.id &&
                                  "sticky top-0 z-10 bg-opacity-75 bg-white"
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
                            "relative whitespace-nowrap py-4 pr-2 pl-3 text-right text-sm font-medium",
                            highlightedRow === row.id &&
                              "sticky top-0 z-10 bg-opacity-75 bg-white"
                          )}
                        >
                          <div className="flex justify-end">
                            <PencilSquareIcon
                              className="w-5 h-5 mr-4 cursor-pointer text-indigo-600 hover:text-indigo-900"
                              onClick={() => {
                                setRowData(row);
                                setEditRow(true);
                              }}
                            />
                            <div className="relative">
                              <TrashIcon
                                className="w-6 h-6 cursor-pointer text-indigo-600 hover:text-indigo-900"
                                onClick={() => {
                                  setHighlightedRow(row.id);
                                  setShowDeleteRow(true);
                                }}
                              />
                              {showDeleteRow && (
                                <DeleteRowModal
                                  row={row}
                                  onDelete={deleteRow}
                                  resetHighlightedRow={setHighlightedRow}
                                />
                              )}
                            </div>
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
    </>
  );
};
