import React from "react";
import { useParams } from "react-router";
import {
  TrashIcon,
  PencilSquareIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react";
import { SidebarContext } from "../states/sidebar_states";
import { FunctionContexts } from "../utils/fetch_handlers";
import {
  ToggleAddRowSlideOver,
  ToggleAddColumnSlideOver,
} from "../utils/slideover_handlers";
import { ShowModalContext } from "../states/show_modals";
import DeleteRowModal from "./modals/delete_row";
import DeleteColumnModal from "./modals/delete_column";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const TableEditor = () => {
  const { table } = useParams();
  const {
    setEditRow,
    setRowData,
    columnConstraints,
    setColumnConstraints,
    setColumnData,
    setShowEditCol,
  } = React.useContext(SidebarContext);
  const {
    columns,
    rows,
    columnConstraintsForTable: getColumnConstraints,
    deleteRowInTable,
    tableDescription,
    deleteColumnInTable,
  } = React.useContext(FunctionContexts);
  const {
    showDeleteRow,
    setShowDeleteRow,
    showDeleteColumn,
    setShowDeleteColumn,
  } = React.useContext(ShowModalContext);
  const [highlightedRow, setHighlightedRow] = React.useState(0);

  React.useEffect(() => {}, [tableDescription]);

  React.useEffect(() => {
    (async () => {
      try {
        const response = await getColumnConstraints(table);
        console.log(response.data);
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

  const createColumnValToConstraintObj = (constraints) => {
    return constraints.reduce((newObj, constraint) => {
      if (
        constraint.constraint_type &&
        Object.keys(constraint.constraint_type).includes("PRIMARY KEY")
      ) {
        newObj[constraint.column_name] = {
          ...constraint,
          primary: true,
          id: 1,
          name: constraint.column_name,
        };
      } else {
        newObj[constraint.column_name] = {
          ...constraint,
          primary: false,
          id: 1,
          name: constraint.column_name,
        };
      }

      return newObj;
    }, {});
  };

  let colValToConstraintObj;

  if (columnConstraints.length) {
    colValToConstraintObj = createColumnValToConstraintObj(columnConstraints);
  }

  const collapseMultipleConstraints = (constraints) => {
    let seen = {};
    constraints.forEach((constraint) => {
      const name = constraint.column_name;
      let clause = constraint.check_clause
        ? constraint.check_clause
        : constraint.constraint_type;
      if (seen[name]) {
        seen[name].constraint_type[clause] = constraint.constraint_name;
      } else {
        seen[name] = constraint;
        if (clause) {
          seen[name].constraint_type = { [clause]: constraint.constraint_name };
        }
      }
    });
    return Object.values(seen);
  };

  const getPrimaryKeyColumn = (columnConstraints) => {
    for (let constraint of columnConstraints) {
      if (
        constraint.constraint_type &&
        Object.keys(constraint.constraint_type).includes("PRIMARY KEY")
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

  const deleteColumn = async (columnName) => {
    try {
      await deleteColumnInTable(table, columnName);
    } catch (error) {
      console.log("Error: Could not delete column from table.");
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
                          <Menu as="div">
                            <div>
                              <Menu.Button className="inline-flex w-full align-middle overflow-hidden ">
                                {`${column.col} (${column.data_type})`}
                                <ChevronDownIcon
                                  className="-mr-1 h-5 w-5 text-indigo-200 hover:text-indigo-950"
                                  aria-hidden="true"
                                />
                              </Menu.Button>
                            </div>

                            <Transition
                              as={React.Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute z-10 mt-2 w-28 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        className={classNames(
                                          active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-700",
                                          "group flex items-center px-4 py-2 text-sm"
                                        )}
                                        onClick={() => {
                                          setColumnData([
                                            {
                                              ...colValToConstraintObj[
                                                column.col
                                              ],
                                            },
                                          ]);
                                          setShowEditCol(true);
                                        }}
                                      >
                                        <PencilSquareIcon
                                          className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                          aria-hidden="true"
                                        />
                                        Edit
                                      </button>
                                    )}
                                  </Menu.Item>
                                </div>
                                <div className="py-1">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        className={classNames(
                                          active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-700",
                                          "group flex items-center px-4 py-2 text-sm"
                                        )}
                                        onClick={async (e) => {
                                          setShowDeleteColumn(true);
                                          setHighlightedRow(null);
                                        }}
                                      >
                                        <TrashIcon
                                          className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                          aria-hidden="true"
                                        />
                                        Delete
                                      </button>
                                    )}
                                  </Menu.Item>
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                          {showDeleteColumn && (
                            <DeleteColumnModal
                              column={column.col}
                              onDeleteColumn={deleteColumn}
                            />
                          )}
                        </th>
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
