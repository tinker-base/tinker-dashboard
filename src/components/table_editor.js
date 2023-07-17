import React from "react";
import { useParams } from "react-router";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { SidebarContext } from "../states/sidebar_states";
import { FunctionContexts } from "../utils/fetch_handlers";
import { ToggleAddRowSlideOver } from "../utils/slideover_handlers";
import { ShowModalContext } from "../states/show_modals";
import DeleteRowModal from "./modals/delete_row";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const TableEditor = () => {
  const { table } = useParams();
  const {
    setEditRow,
    setRowData,
    rowData,
    columnConstraints,
    setColumnConstraints,
  } = React.useContext(SidebarContext);
  const {
    columns,
    rows,
    columnConstraintsForTable: getColumnConstraints,
    deleteRowInTable,
  } = React.useContext(FunctionContexts);
  const { showDeleteRow, setShowDeleteRow } =
    React.useContext(ShowModalContext);
  const [highlightedRow, setHighlightedRow] = React.useState(0);

  React.useEffect(() => {
    (async () => {
      try {
        const { data } = await getColumnConstraints(table);
        const multipleConstraintsCollapsed = collapseMultipleConstraints(data);
        setColumnConstraints(multipleConstraintsCollapsed);
      } catch (err) {
        console.log("error retrieving table constraints");
      }
    })();
  }, [table, getColumnConstraints]);

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
                        className={classNames(
                          !highlightedRow && "sticky top-0 z-10 bg-opacity-75",
                          "border-b border-gray-300 bg-white py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                        )}
                      >
                        {`${column.col} (${column.data_type})`}
                      </th>
                    );
                  })}
                  <th
                    scope="col"
                    className={classNames(
                      !highlightedRow && "sticky top-0 z-10 bg-opacity-75",
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
  );
};
