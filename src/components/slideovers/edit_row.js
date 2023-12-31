import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { SidebarContext } from "../../states/sidebar_states";
import { useParams } from "react-router";
import { SuccessBanner } from "../banners/success_banner";
import { ErrorBanner } from "../banners/error_banner";
import { FunctionContexts } from "../../utils/fetch_handlers";

export const EditRowSlideOver = () => {
  const { table } = useParams();
  const { editRow, setEditRow, columnConstraints } =
    React.useContext(SidebarContext);
  const { editRowInTable: onEditRow } = React.useContext(FunctionContexts);
  const { rowData } = React.useContext(SidebarContext);
  const [rowDataCopy, setRowDataCopy] = React.useState({});
  const [tableNameBlur, setTableNameBlur] = React.useState(false);
  const [successBanner, setSuccessBanner] = React.useState(false);
  const [errorBanner, setErrorBanner] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    setRowDataCopy({ ...rowData });
  }, [table, editRow, rowData]);

  const formatDefaultString = (column_default) => {
    let placeholder = column_default.split(":")[0];
    if (placeholder[0] === "'") {
      placeholder = placeholder.slice(1, placeholder.length - 1);
    }

    return placeholder;
  };

  const onlyColumnsWithValues = () => {
    return Object.keys(rowDataCopy).reduce((newObj, column) => {
      if (rowDataCopy[column]) {
        newObj[column] = rowDataCopy[column];
      }
      return newObj;
    }, {});
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

  // createPKObject();

  const editRowInTable = async (e) => {
    e.preventDefault();
    setErrorBanner(false);
    setSuccessBanner(false);
    try {
      const updatedColumns = onlyColumnsWithValues();
      const pkObject = createPKObject(rowData, columnConstraints);
      await onEditRow(table, updatedColumns, pkObject);
      setSuccessBanner(true);
      setTimeout(() => {
        closeAndResetSlideOver();
        setRowDataCopy({});
      }, 1000);
    } catch (error) {
      setErrorMessage(
        "Failed to run sql query: " + error.response.data.message
      );
      setErrorBanner(true);
    }
  };

  const setPlaceHolder = (constraint) => {
    let placeholder = "";
    if (constraint.column_default) {
      if (constraint.column_default.indexOf("nextval") !== -1) {
        placeholder = "Automatically generated in sequence";
      } else {
        placeholder = formatDefaultString(constraint.column_default);
      }
    } else if (constraint.data_type === "timestamptz") {
      placeholder = "CURRENT_TIMESTAMP";
    } else if (!constraint.nullable) {
      placeholder = "NULL";
    }

    return placeholder;
  };

  const formatClause = (string) => {
    return string.replace(/\(+/g, "(").replace(/\)+/g, ")");
  };

  const toDatetimeLocal = (dateString) => {
    const date = new Date(dateString),
      ten = function (i) {
        return (i < 10 ? "0" : "") + i;
      },
      YYYY = date.getFullYear(),
      MM = ten(date.getMonth() + 1),
      DD = ten(date.getDate()),
      HH = ten(date.getHours()),
      II = ten(date.getMinutes()),
      SS = ten(date.getSeconds());
    return YYYY + "-" + MM + "-" + DD + "T" + HH + ":" + II + ":" + SS;
  };

  const displayInputWithConstraints = (constraintObj, placeholder) => {
    const columnName = constraintObj.column_name;

    if (
      constraintObj.character_maximum_length &&
      constraintObj.character_maximum_length >= 100
    ) {
      return (
        <textarea
          type="text"
          name="project-name"
          rows="4"
          placeholder={placeholder}
          value={rowDataCopy[columnName] || placeholder}
          onChange={function (e) {
            rowDataCopy[columnName] = e.target.value;
            setRowDataCopy({
              ...rowDataCopy,
            });
          }}
          onBlur={() => setTableNameBlur(true)}
          className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      );
    } else if (constraintObj.data_type === "bool") {
      return (
        <select
          type="text"
          name="project-name"
          value={rowDataCopy[columnName] || placeholder || "true"}
          onChange={function (e) {
            rowDataCopy[columnName] = e.target.value;
            setRowDataCopy({
              ...rowDataCopy,
            });
          }}
          onBlur={() => setTableNameBlur(true)}
          className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      );
    } else if (placeholder === "CURRENT_TIMESTAMP") {
      return (
        <input
          type="datetime-local"
          name="project-name"
          placeholder={placeholder}
          value={
            rowDataCopy[columnName]
              ? toDatetimeLocal(rowDataCopy[columnName])
              : ""
          }
          onChange={function (e) {
            rowDataCopy[columnName] = e.target.value;
            setRowDataCopy({
              ...rowDataCopy,
            });
          }}
          onBlur={() => setTableNameBlur(true)}
          className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      );
    } else {
      return (
        <input
          type="text"
          name="project-name"
          placeholder={placeholder}
          value={rowDataCopy[columnName] || ""}
          onChange={function (e) {
            rowDataCopy[columnName] = e.target.value;
            setRowDataCopy({
              ...rowDataCopy,
            });
          }}
          onBlur={() => setTableNameBlur(true)}
          className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      );
    }
  };

  function displayColumns() {
    return columnConstraints.map((constraint) => {
      let placeholder = setPlaceHolder(constraint);
      const columnName = constraint.column_name;
      return (
        <div
          className="divide-y divide-gray-200 px-4 sm:px-6"
          key={constraint.column_name}
        >
          <div className="space-y-6 pb-5 pt-6">
            <div>
              <label
                htmlFor="project-name"
                className="text-sm font-medium leading-6 text-gray-900 mr-2"
              >
                <span className="px-2">
                  {columnName} <span>({constraint.data_type})</span>
                </span>
              </label>
              <div className="mt-2">
                {displayInputWithConstraints(constraint, placeholder)}

                <span className="text-gray-400 text-sm italic px-2">
                  {constraint.constraint_type
                    ? formatClause(
                        Object.keys(constraint.constraint_type).join(", ")
                      )
                    : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  ///There may be data with multiple constraints

  const closeAndResetSlideOver = (e) => {
    if (e) {
      e.preventDefault();
    }
    setRowDataCopy({});
    setErrorMessage("");
    setErrorBanner(false);
    setSuccessBanner(false);
    setEditRow(false);
    setTableNameBlur(false);
  };

  return (
    <Transition.Root show={editRow} as={React.Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={closeAndResetSlideOver}
      >
        <div className="fixed inset-0 bg-gray-200/50" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={React.Fragment}
                enter="transform transition ease-in-out duration-400 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-400 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-xl">
                  <div
                    aria-live="assertive"
                    className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-100"
                  >
                    {successBanner ? (
                      <SuccessBanner message={"Row successfully updated!"} />
                    ) : null}
                    {errorBanner ? <ErrorBanner error={errorMessage} /> : null}
                  </div>
                  <form
                    className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
                    onSubmit={editRowInTable}
                  >
                    <div className="h-0 flex-1 overflow-y-auto">
                      <div className="bg-indigo-700 px-4 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-white">
                            Edit Row
                          </Dialog.Title>

                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-indigo-700 text-indigo-200 hover:text-white "
                              onClick={() => {
                                closeAndResetSlideOver();
                              }}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-indigo-300">
                            Edit a row to an existing {table} table.
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        {displayColumns()}
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={() => {
                          closeAndResetSlideOver();
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Insert Row
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
