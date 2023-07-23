import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { LinkIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { SidebarContext } from "../../states/sidebar_states";
import { DataTypeSelect } from "../selects/data_type_select";
import { SuccessBanner } from "../banners/success_banner";
import { ErrorBanner } from "../banners/error_banner";
import { FunctionContexts } from "../../utils/fetch_handlers";
import { ForeignKeySlideOver } from "./add_foreign_key";
import { useParams } from "react-router";

const Column = ({
  column,
  onColInputChange,
  onColNullClick,
  onColUniqueClick,
  onPrimaryRadioClick,
  setCurrentCol,
  formatDefault,
}) => {
  const { setShowForeignKey } = React.useContext(SidebarContext);

  return (
    <>
      <div className="col-span-2">
        <input
          type="text"
          name="name"
          className=" block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          value={column.column_name}
          onChange={(e) => onColInputChange(column.id, e)}
        />
      </div>
      <div
        className="col-span-1 p-1 rounded-md text-gray-700 border border-solid border-gray-200 bg-gray-100 hover:bg-gray-300"
        onClick={() => {
          setCurrentCol(column);
          setShowForeignKey(true);
        }}
      >
        <LinkIcon className="w-6 h-6" />
      </div>
      <div className="col-span-2 w-full">
        <DataTypeSelect
          id={column.id}
          onColInputChange={onColInputChange}
          value={column.data_type}
        />
      </div>
      <div className="col-span-2">
        <input
          type="text"
          name="default"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          value={formatDefault(column.column_default)}
          onChange={(e) => onColInputChange(column.id, e)}
          placeholder="NULL"
        />
      </div>
      <div className="flex justify-center col-span-1">
        <input
          className=""
          name="primary"
          type="checkbox"
          onChange={(e) => {
            onPrimaryRadioClick(column.id);
          }}
          checked={column.primary}
        />
      </div>
      <div className="flex justify-center col-span-1">
        <input
          name="notNull"
          type="checkbox"
          onChange={() => onColNullClick(column.id)}
          checked={!!column.nullable}
        />
      </div>
      <div className="flex justify-center col-span-1">
        <input
          name="unique"
          type="checkbox"
          onChange={() => onColUniqueClick(column.id)}
          checked={column.unique}
        />
      </div>
    </>
  );
};

export const EditColumnSlideOver = () => {
  const { table } = useParams();
  const { showEditCol, setShowEditCol, columnConstraints, columnData } =
    React.useContext(SidebarContext);
  const { alterColumnInTable } = React.useContext(FunctionContexts);

  const [columnDataCopy, setColumnDataCopy] = React.useState({});

  const [successBanner, setSuccessBanner] = React.useState(false);
  const [errorBanner, setErrorBanner] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [currentCol, setCurrentCol] = React.useState({});
  const [foreignKeys, setForeignKeys] = React.useState([]);

  React.useEffect(() => {
    if (columnData.length) {
      let copy = JSON.stringify(columnData);
      copy = JSON.parse(copy);
      setColumnDataCopy(copy);
    }
  }, [columnData]);

  const stringifyChangedData = (table, changedData, oldDataObj) => {
    let columnName = oldDataObj.column_name;
    const alterTableString = `ALTER TABLE ${table}`;
    const result = [];
    if (changedData.column_name) {
      result.push(
        `${alterTableString} RENAME COLUMN ${columnName} TO ${changedData.column_name};`
      );
      columnName = changedData.column_name;
    }

    if (changedData.data_type) {
      if (
        changedData.data_type === "bool" &&
        ["text", "varchar"].includes(oldDataObj.data_type)
      ) {
        result.push(returnTextToBoolSQL(alterTableString, columnName));
      } else if (
        changedData.data_type === "bool" &&
        ["int2", "int4", "int8", "float4", "float8", "numeric"].includes(
          oldDataObj.data_type
        )
      ) {
        result.push(returnIntToBoolSQL(alterTableString, columnName));
      } else {
        result.push(
          `${alterTableString} ALTER COLUMN ${columnName} TYPE ${changedData.data_type};`
        );
      }
    }

    if (changedData.column_default !== undefined) {
      result.push(
        `${alterTableString} ALTER COLUMN ${columnName} SET DEFAULT ${
          `'${changedData.column_default}'` || "NULL"
        };`
      );
    }

    if (changedData.primary) {
      const pkey = getConstraintKeyName(columnConstraints, "PRIMARY KEY");
      result.push(
        `${alterTableString} DROP CONSTRAINT ${pkey};`,
        `${alterTableString} ADD PRIMARY KEY (${columnName});`
      );
    }

    if (changedData.unique !== undefined) {
      const uniqueKey = getConstraintKeyName(columnConstraints, "UNIQUE");
      if (uniqueKey) {
        result.push(`${alterTableString} DROP CONSTRAINT ${uniqueKey};`);
      } else {
        result.push(`${alterTableString} ADD UNIQUE (${columnName});`);
      }
    }

    if (changedData.nullable !== undefined) {
      if (!changedData.nullable) {
        result.push(
          `${alterTableString} ALTER COLUMN ${columnName} DROP NOT NULL;`
        );
      } else {
        result.push(
          `${alterTableString} ALTER COLUMN ${columnName} SET NOT NULL;`
        );
      }
    }

    const fk = foreignKeys.find((fk) => fk.id === 1);
    if (fk) {
      result.push(`${alterTableString} ADD ${fk.command};`);
    }

    return result.join(" ");
  };

  const returnTextToBoolSQL = (alterTableString, columnName) => {
    return (
      `${alterTableString} ALTER COLUMN ${columnName} TYPE boolean USING ` +
      `CASE WHEN ${columnName} = 'true' THEN true WHEN ${columnName} = 'false' THEN false ` +
      `ELSE null END;`
    );
  };

  const returnIntToBoolSQL = (alterTableString, columnName) => {
    return (
      `${alterTableString} ALTER COLUMN ${columnName} TYPE boolean USING ` +
      `CASE WHEN ${columnName} = 1 THEN true WHEN ${columnName} = 0 THEN false ` +
      `ELSE null END;`
    );
  };

  const getConstraintKeyName = (columnConstraints, keyName) => {
    for (let constraint of columnConstraints) {
      if (
        constraint.constraint_type &&
        Object.keys(constraint.constraint_type).includes(keyName)
      ) {
        return constraint.constraint_type[keyName];
      }
    }
  };

  const formatDefaultVal = (defaultVal) => {
    if (!defaultVal || defaultVal.indexOf("nextval") !== -1) {
      return "";
    }
    let dValue = defaultVal.split(":")[0];
    if (dValue[0] === "'") {
      dValue = dValue.slice(1, dValue.length - 1);
    }
    return dValue;
  };

  const formatData = (table) => {
    const updatedData = returnAlteredData(columnDataCopy[0], columnData[0]);

    return stringifyChangedData(table, updatedData, columnData[0]);
  };

  const alterColumn = async (table) => {
    try {
      const alteration_commands = formatData(table);
      if (Object.keys(alteration_commands).length) {
        await alterColumnInTable(table, alteration_commands);
        setSuccessBanner(true);
        setTimeout(() => {
          closeAndResetSlideOver();
        }, 1000);
      }
    } catch (error) {
      setErrorMessage(
        "Failed to run sql query: " + error.response.data.message
      );
      setErrorBanner(true);
      console.log("Could not alter table");
    }
  };

  const closeAndResetSlideOver = () => {
    setShowEditCol(false);
    setErrorBanner(false);
    setSuccessBanner(false);
    setTimeout(() => {
      setColumnDataCopy([]);
      setForeignKeys([]);
    }, 1000);
  };

  const handleColumnInputChange = (id, event) => {
    const { name, value } = event.target;
    let convertedName;

    if (name === "name") {
      convertedName = "column_name";
    } else if (name === "type") {
      convertedName = "data_type";
    } else if (name === "default") {
      convertedName = "column_default";
    }

    const updated = columnDataCopy.map((column) => {
      if (column.id === id) {
        return { ...column, [convertedName]: value };
      }

      return { ...column };
    });

    setColumnDataCopy(updated);
  };

  const togglePrimaryRadio = (id) => {
    columnDataCopy[0] = {
      ...columnDataCopy[0],
      primary: !columnDataCopy[0].primary,
    };
    setColumnDataCopy([...columnDataCopy]);
  };

  const toggleUniqueClick = (id) => {
    columnDataCopy[0] = {
      ...columnDataCopy[0],
      unique: !columnDataCopy[0].unique,
    };

    setColumnDataCopy([...columnDataCopy]);
  };

  const toggleNullClick = (id) => {
    columnDataCopy[0] = {
      ...columnDataCopy[0],
      nullable: columnDataCopy[0].nullable ? "" : "NOT NULL",
    };
    setColumnDataCopy([...columnDataCopy]);
  };

  const returnAlteredData = (newDataObj, oldDataObj) => {
    return Object.keys(newDataObj).reduce((newObj, key) => {
      if (newDataObj[key] !== oldDataObj[key] && key !== "constraint_type") {
        newObj[key] = newDataObj[key];
      }

      return newObj;
    }, {});
  };

  return (
    <>
      <Transition.Root show={showEditCol} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={closeAndResetSlideOver}
        >
          <div className="fixed inset-0 bg-gray-200/50" />

          <ForeignKeySlideOver
            colObj={columnDataCopy[0] || {}}
            setForeignKeys={setForeignKeys}
          />

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
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                    <div
                      aria-live="assertive"
                      className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-100"
                    >
                      {successBanner ? (
                        <SuccessBanner
                          message={"Column successfully edited!"}
                        />
                      ) : null}
                      {errorBanner ? (
                        <ErrorBanner error={errorMessage} />
                      ) : null}
                    </div>
                    <form
                      className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setSuccessBanner(false);
                        setErrorBanner(false);

                        await alterColumn(table);
                      }}
                    >
                      <div className="h-0 flex-1 overflow-y-auto">
                        <div className="bg-indigo-700 px-4 py-6 sm:px-6">
                          <div className="flex items-center justify-between">
                            <Dialog.Title className="text-base font-semibold leading-6 text-white">
                              Edit Column
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
                              Edit column name, foreign key, data type, default
                              and constraints.
                            </p>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="grid justify-items-center grid-cols-10 gap-2 items-center content-center ">
                            <div className="col-span-2">
                              <h5>Name</h5>
                            </div>
                            <div className="col-span-1">
                              <h5>Foreign Key</h5>
                            </div>
                            <div className="col-span-2">
                              <h5>Data Type</h5>
                            </div>
                            <div className="col-span-2">
                              <h5>Default</h5>
                            </div>
                            <div className="col-span-1">
                              <h5>Primary Key</h5>
                            </div>
                            <div className="col-span-1 text-center">
                              <h5>Not Null</h5>
                            </div>
                            <div className="col-span-1">
                              <h5>Unique</h5>
                            </div>

                            {columnDataCopy.length &&
                              columnDataCopy.map((column) => {
                                return (
                                  <Column
                                    key={column.id}
                                    id={column.id}
                                    column={column}
                                    onColInputChange={handleColumnInputChange}
                                    onPrimaryRadioClick={togglePrimaryRadio}
                                    onColNullClick={toggleNullClick}
                                    onColUniqueClick={toggleUniqueClick}
                                    setCurrentCol={setCurrentCol}
                                    formatDefault={formatDefaultVal}
                                  />
                                );
                              })}
                          </div>
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
                          Exit
                        </button>
                        <button
                          type="submit"
                          className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:text-gray-400 disabled:bg-gray-300"
                        >
                          Edit Column
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
    </>
  );
};
