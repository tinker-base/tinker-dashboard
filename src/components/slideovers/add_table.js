import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { LinkIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { SidebarContext } from "../../states/sidebar_states";
import { validTableName, whiteSpace } from "../../utils/helpers";
import { DataTypeSelect } from "../selects/data_type_select";
import { PlusIcon } from "@heroicons/react/24/outline";
import { SuccessBanner } from "../banners/success_banner";
import { ErrorBanner } from "../banners/error_banner";
import { FunctionContexts } from "../../utils/fetch_handlers";
import { ForeignKeySlideOver } from "./add_foreign_key";

const Column = ({
  column,
  onDeleteColumn,
  onColInputChange,
  onPrimaryRadioClick,
  setCurrentCol,
}) => {
  const { setShowForeignKey } = React.useContext(SidebarContext);

  return (
    <>
      <div className="col-span-2">
        <input
          type="text"
          name="name"
          className=" block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          value={column.name}
          onChange={(e) => onColInputChange(column.id, e)}
          placeholder="column-name"
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
        <DataTypeSelect id={column.id} onColInputChange={onColInputChange} />
      </div>
      <div className="col-span-2">
        <input
          type="text"
          name="default"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          value={column.default}
          onChange={(e) => onColInputChange(column.id, e)}
          placeholder="NULL"
        />
      </div>
      <div className="flex justify-center col-span-1">
        <input
          className=""
          name="primary"
          type="radio"
          onChange={(e) => {
            onPrimaryRadioClick(column.id, e);
          }}
          checked={column.primary}
        />
      </div>
      <div className="flex justify-center col-span-1 cursor-pointer hover:text-gray-600">
        <TrashIcon
          className="w-6 h-6"
          onClick={() => onDeleteColumn(column.id)}
        />
      </div>
    </>
  );
};

export const AddTableSlideOver = () => {
  const { addTable, setAddTable } = React.useContext(SidebarContext);
  const { handleCreateNewTable, selectedSchema, handleAddTableDescription } =
    React.useContext(FunctionContexts);
  // const { showForeignKey } = React.useContext(SidebarContext);

  const [formData, setFormData] = React.useState({ name: "", description: "" });
  const [blurs, setBlurs] = React.useState({ name: false, description: false });
  const [validForm, setValidForm] = React.useState(false);
  const [columns, setColumns] = React.useState([
    {
      id: 1,
      name: "id",
      type: "int4",
      default: "",
      primary: true,
    },
  ]);
  const [columnCount, setColCount] = React.useState(2);
  const [successBanner, setSuccessBanner] = React.useState(false);
  const [errorBanner, setErrorBanner] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [currentCol, setCurrentCol] = React.useState({});
  const [foreignKeys, setForeignKeys] = React.useState([]);

  React.useEffect(() => {
    validateForm();
  }, [formData]);

  const stringifyColumns = () => {
    const result = [];
    columns.forEach((col) => {
      const currentCol = [];
      currentCol.push(col.name);
      currentCol.push(col.type);
      if (col.default) {
        currentCol.push("DEFAULT");
        currentCol.push(`'${col.default}'`);
      }
      const fk = foreignKeys.find((fk) => fk.id === col.id);
      if (fk) {
        currentCol.push(fk.command);
      }
      result.push(currentCol.join(" "));
    });

    return result.flat();
  };

  const findKeyCol = () => {
    const keyCol = columns.find((col) => col.primary === true);
    return keyCol.name;
  };

  const formatData = () => {
    const result = {
      schema_name: selectedSchema,
      table_name: formData.name,
      columns: stringifyColumns(),
      primary_key_column: findKeyCol(),
    };
    return result;
  };

  const addColumn = async () => {
    setColumns((prev) =>
      prev.concat({
        id: columnCount,
        name: "",
        type: "",
        default: "",
        primary: false,
      })
    );
    setColCount((prev) => prev + 1);
  };

  const deleteColumn = (id) => {
    const filtered = columns.filter((col) => String(col.id) !== String(id));
    setColumns(filtered);
    const fileterFK = foreignKeys.filter((fk) => String(fk.id) !== String(id));
    setForeignKeys(fileterFK);
  };

  const closeAndResetSlideOver = () => {
    setAddTable(false);
    setColumns([
      {
        id: 1,
        name: "id",
        type: "int4",
        default: "",
        primary: true,
      },
    ]);
    setColCount(2);
    setBlurs({ name: false, description: false });
    setFormData({ name: "", description: "" });
    setErrorBanner(false);
    setSuccessBanner(false);
    setForeignKeys([]);
  };

  const validateForm = () => {
    if (validTableName(formData.name)) {
      setValidForm(true);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleColumnInputChange = (id, event) => {
    const { name, value } = event.target;
    const updated = columns.map((column) => {
      if (column.id === id) {
        return { ...column, [name]: value };
      }
      return column;
    });
    setColumns(updated);
  };

  const togglePrimaryRadio = (id) => {
    setColumns((prev) => {
      return prev.map((col) => {
        col.id === id ? (col.primary = true) : (col.primary = false);
        return col;
      });
    });
  };

  const formatDescription = () => {
    return {
      p_schema_name: selectedSchema,
      p_table_name: formData.name,
      p_comment: formData.description,
    };
  };

  const TableNameInputErrorMessage = () => {
    if (formData.name.length === 0 && blurs.name) {
      return (
        <span className="text-red-600 text-xs">Table name cannot be empty</span>
      );
    } else if (whiteSpace(formData.name)) {
      return (
        <span className="text-red-600 text-xs">
          Table name cannot contain spaces
        </span>
      );
    } else if (formData.name.length > 31) {
      return (
        <span className="text-red-600 text-xs">
          Table name cannot be more than 31 chars
        </span>
      );
    } else if (!validTableName(formData.name) && blurs.name) {
      return (
        <span className="text-red-600 text-xs">
          Project name must start with lowercase letters (a-z) or underscore (_)
          & may only contain lowercase letters (a-z), numbers (0-9) and
          underscore (_).
        </span>
      );
    } else {
      return <span className="opacity-0">hidden</span>;
    }
  };

  return (
    <>
      <Transition.Root show={addTable} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={closeAndResetSlideOver}
        >
          <div className="fixed inset-0 bg-gray-200/50" />

          <ForeignKeySlideOver
            colObj={currentCol}
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
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-xl">
                    <div
                      aria-live="assertive"
                      className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-100"
                    >
                      {successBanner ? (
                        <SuccessBanner
                          message={"Table successfully created!"}
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

                        const response = await handleCreateNewTable(
                          formatData()
                        );
                        if (response === true) {
                          const res = await handleAddTableDescription(
                            formatDescription()
                          );
                          if (res === true) {
                            setSuccessBanner(true);
                            setTimeout(() => {
                              closeAndResetSlideOver();
                            }, 2000);
                          } else {
                            setErrorMessage(response.message);
                            setErrorBanner(true);
                          }
                        } else {
                          setErrorMessage(response.message);
                          setErrorBanner(true);
                        }
                      }}
                    >
                      <div className="h-0 flex-1 overflow-y-auto">
                        <div className="bg-indigo-700 px-4 py-6 sm:px-6">
                          <div className="flex items-center justify-between">
                            <Dialog.Title className="text-base font-semibold leading-6 text-white">
                              New Table
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
                              Add column names, foreign keys, data types,
                              defaults and constraints.
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col justify-between">
                          <div className=" divide-gray-200 px-4 sm:px-6">
                            <div className=" pb-2 pt-6">
                              <div>
                                <label
                                  htmlFor="name"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Name
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="name"
                                    id="tableName"
                                    value={formData.name}
                                    onChange={(e) => {
                                      handleInputChange(e);
                                    }}
                                    onBlur={() => {
                                      setBlurs(() => {
                                        return { ...blurs, name: true };
                                      });
                                    }}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                  <TableNameInputErrorMessage />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className=" divide-gray-200 px-4 sm:px-6">
                            <div className=" pb-2 pt-2">
                              <div>
                                <label
                                  htmlFor="description"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Description
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="description"
                                    id="tableDescription"
                                    value={formData.description}
                                    onChange={(e) => {
                                      handleInputChange(e);
                                    }}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <span>Columns</span>
                          <div className="grid justify-items-center grid-cols-9 gap-2 items-center content-center ">
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
                            <div className="col-span-1">
                              <h5>Delete</h5>
                            </div>
                            {/* 
                            <div className="">
                            <h5>Unique</h5>
                          </div> */}

                            {columns.map((column) => {
                              return (
                                <Column
                                  key={column.id}
                                  id={column.id}
                                  column={column}
                                  onDeleteColumn={deleteColumn}
                                  onColInputChange={handleColumnInputChange}
                                  onPrimaryRadioClick={togglePrimaryRadio}
                                  setCurrentCol={setCurrentCol}
                                />
                              );
                            })}
                          </div>

                          <button
                            className="mt-4 flex content-center hover:bg-indigo-200 text-indigo-700 "
                            onClick={(e) => {
                              e.preventDefault();
                              addColumn();
                            }}
                          >
                            <PlusIcon
                              className="inline-block h-6 w-6 shrink-0 text-indigo-700"
                              aria-hidden="true"
                            />
                            Add Column
                          </button>
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
                          disabled={!validForm}
                        >
                          Create Table
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
