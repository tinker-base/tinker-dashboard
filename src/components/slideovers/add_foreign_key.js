import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { SidebarContext } from "../../states/sidebar_states";
import { SchemaSelect } from "../selects/schema_select";
import { SelectTable } from "../selects/select_table";
import { SelectCol } from "../selects/select_rows";
import { FunctionContexts } from "../../utils/fetch_handlers";
import { getAllTablesInSchema, getColumns } from "../../services/services";

export const ForeignKeySlideOver = ({ colObj, setForeignKeys }) => {
  const { showForeignKey, setShowForeignKey } =
    React.useContext(SidebarContext);
  const { schemas, projectURL, jwt } = React.useContext(FunctionContexts);

  const [currentTables, setCurrentTables] = React.useState(["-"]);
  const [currentCols, setCurrentCols] = React.useState(["-"]);
  const [selectedSchema, setSelectedSchema] = React.useState("public");
  const [selectedTable, setSelectedTable] = React.useState("-");
  const [selectedCol, setSelectedCol] = React.useState("");

  const fetchTables = async (schema) => {
    try {
      const { data } = await getAllTablesInSchema(projectURL, schema, jwt);
      setCurrentTables(data);
    } catch (error) {
      console.log("error getting tables: ", error);
    }
  };

  const fetchCols = async () => {
    try {
      const { data } = await getColumns(projectURL, selectedTable, jwt);
      setCurrentCols(data);
    } catch (error) {
      console.log("error getting columns: ", error);
    }
  };

  React.useEffect(() => {
    fetchTables("public");
  }, []);

  React.useEffect(() => {
    fetchTables(selectedSchema);
    setSelectedTable("-");
    setSelectedCol("-");
    setCurrentCols([{ col: "-" }]);
  }, [selectedSchema]);

  React.useEffect(() => {
    if (selectedTable !== "-") {
      fetchCols();
    }
  }, [selectedTable]);

  const closeForeignKeySidebar = () => {
    setShowForeignKey(false);
    setSelectedSchema("public");
    setSelectedTable("-");
    setSelectedCol("-");
    setCurrentCols([{ col: "-" }]);
  };

  const formatForeignKeyString = () => {
    setForeignKeys((prev) =>
      prev.concat({
        id: colObj.id,
        command: `FOREIGN KEY (${colObj.name}) REFERENCES ${selectedSchema}.${selectedTable}(${selectedCol})`,
      })
    );
  };

  return (
    <Transition.Root show={showForeignKey} as={React.Fragment}>
      <Dialog
        as="div"
        className="relative z-[60]"
        onClose={closeForeignKeySidebar}
      >
        <div className="fixed inset-0 bg-gray-200/50" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={React.Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <form
                    className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
                    onSubmit={(e) => {
                      e.preventDefault();
                      formatForeignKeyString();
                      closeForeignKeySidebar();
                    }}
                  >
                    <div className="h-0 flex-1 overflow-y-auto">
                      <div className="bg-indigo-700 px-4 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-white">
                            Add Foreign Key Constraint on column: "{colObj.name}
                            "
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={closeForeignKeySidebar}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="divide-y divide-gray-200 px-4 sm:px-6">
                          <div className="space-y-6 pb-5 pt-6">
                            <div>
                              <SchemaSelect
                                schemas={schemas}
                                selectedSchema={selectedSchema}
                                setSelectedSchema={setSelectedSchema}
                              />
                            </div>
                            <div>
                              <SelectTable
                                tables={currentTables}
                                selectedTable={selectedTable}
                                setSelectedTable={setSelectedTable}
                              />
                            </div>
                            <div>
                              <SelectCol
                                cols={currentCols}
                                selectedCol={selectedCol}
                                setSelectedCol={setSelectedCol}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={closeForeignKeySidebar}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Save
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
