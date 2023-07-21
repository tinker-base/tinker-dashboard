import React from "react";
import { SchemaSelect } from "../selects/schema_select";
import { Link, useParams } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { useSignOut } from "../../utils/custom_hooks/signOut";
import {
  Cog6ToothIcon,
  HomeIcon,
  TableCellsIcon,
  PlusIcon,
  ChevronDownIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { ShowModalContext } from "../../states/show_modals";
import { DeleteTableModal } from "../modals/delete_table";
import { FunctionContexts } from "../../utils/fetch_handlers";
import { ProjectDataContext } from "../../states/project_details";
import {
  ToggleAddTableSlideOver,
  ToggleAddSchemaSlideOver,
  ToggleEditTableSlideOver,
} from "../../utils/slideover_handlers";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Tables = () => {
  const { project, table } = useParams();
  const signOut = useSignOut();
  const { showDeleteTable, setShowDeleteTable } =
    React.useContext(ShowModalContext);
  const {
    projectURL,
    getSchemas,
    schemas,
    getTables,
    tables,
    getTableRows,
    selectedSchema,
    setSelectedSchema,
    selectedTable,
    setSelectedTable,
    getTableDescription,
  } = React.useContext(FunctionContexts);
  const { jwt, setProjectURL } = React.useContext(ProjectDataContext);

  const toggleEditTable = ToggleEditTableSlideOver();

  const userNavigation = [
    // { name: "Your profile", href: () => {} },
    { name: "Sign out", href: signOut },
  ];

  React.useEffect(() => {
    if (!jwt && project) {
      (async () => {
        try {
          setProjectURL(sessionStorage.getItem("projectIP"));

          await persistTableData(
            sessionStorage.getItem("projectIP"),
            sessionStorage.getItem("token")
          );
        } catch (e) {
          console.log(
            "Error: Could not retrieve tables and schema after refresh."
          );
        }
      })();
    }
  }, []);

  async function persistTableData(sessionIP, sessionToken) {
    if (table) {
      return Promise.all([
        getSchemas(sessionIP, sessionToken),
        getTables(sessionIP, "public", sessionToken),
        getTableRows(table, sessionIP, sessionToken),
      ]);
    } else {
      return Promise.all([
        await getSchemas(sessionIP, sessionToken),
        await getTables(sessionIP, "public", sessionToken),
      ]);
    }
  }

  const confirmTableDelete = () => {
    setShowDeleteTable(true);
  };

  React.useEffect(() => {
    const fetchTables = async () => {
      try {
        await getTables(projectURL, selectedSchema, jwt);
      } catch (error) {}
    };
    fetchTables();
  }, [selectedSchema]);

  return (
    <>
      {showDeleteTable ? <DeleteTableModal /> : null}
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
      <div className="flex justify-between ">
        <div className="text-indigo-200 w-full pr-4">
          <SchemaSelect
            schemas={schemas}
            selectedSchema={selectedSchema}
            setSelectedSchema={setSelectedSchema}
          />
        </div>
        {/* <PlusIcon
          className="h-6 w-6 shrink-0 self-end text-indigo-200 hover:bg-indigo-700 border rounded-full border-indigo-200 hover:text-white hover:border-white"
          onClick={ToggleAddSchemaSlideOver()}
          aria-hidden="true"
        /> */}
      </div>
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
        {/* adding tables button */}
        <PlusIcon
          className="h-6 w-6 shrink-0 text-indigo-200 hover:bg-indigo-700 border rounded-full border-indigo-200 hover:text-white hover:border-white"
          onClick={ToggleAddTableSlideOver()}
          aria-hidden="true"
        />
      </div>
      <div className="">
        <ul className="flex flex-col gap-y-1 overflow-auto h-96">
          {tables.map((tableName) => (
            <li
              key={tableName}
              className={classNames(
                table === tableName ? "text-white bg-indigo-700" : "",
                `flex justify-between text-indigo-100 hover:text-white hover:bg-indigo-700 rounded-md p-2`
              )}
              onClick={() => {
                getTableDescription(selectedSchema, tableName);
                getTableRows(tableName);
              }}
            >
              <Link
                to={`tables/${tableName}`}
                className="truncate w-full group flex gap-x-3 text-sm leading-6 font-semibold"
              >
                {tableName}
              </Link>

              {/* table dropdown menu */}

              <Menu as="div">
                <div>
                  <Menu.Button className="inline-flex w-full justify-center align-middle overflow-hidden ">
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
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-28 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div
                      className="py-1"
                      data-table_name={tableName}
                      onClick={(e) => {
                        setSelectedTable(e.currentTarget.dataset.table_name);
                        toggleEditTable();
                      }}
                    >
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "group flex items-center px-4 py-2 text-sm"
                            )}
                            data-table_name={tableName}
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
                    <div
                      className="py-1"
                      data-table_name={tableName}
                      onClick={(e) => {
                        setSelectedTable(e.currentTarget.dataset.table_name);
                        confirmTableDelete();
                      }}
                    >
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "group flex items-center px-4 py-2 text-sm"
                            )}
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
            </li>
          ))}
        </ul>
      </div>
      <div className="fixed bottom-4 w-44">
        {/* Settings popup */}

        <Menu as="div" className="relative">
          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="right-0 z-10 w-32 origin-bottom-left rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
              {userNavigation.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <button
                      onClick={() => item.href()}
                      className={classNames(
                        active ? "bg-gray-50" : "",
                        "block px-3 py-1 text-sm w-full text-left leading-6 text-gray-900"
                      )}
                    >
                      {item.name}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
          <Menu.Button className="-m-1.5 flex w-full items-center p-1.5 rounded-md hover:bg-indigo-700 hover:text-white">
            <span className="sr-only">Open user menu</span>
            <span className=" flex items-center w-full">
              <span className="group -mx-2 flex gap-x-3  p-2 text-sm font-semibold leading-6 text-indigo-200  ">
                <Cog6ToothIcon
                  className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
                  aria-hidden="true"
                />
                Settings
              </span>
            </span>
          </Menu.Button>
        </Menu>
      </div>
    </>
  );
};
