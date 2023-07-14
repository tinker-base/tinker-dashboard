import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { SidebarContext } from "../../states/sidebar_states";
// import { validTableName, whiteSpace } from "../../utils/helpers";
import { useParams } from "react-router";
import { SuccessBanner } from "../banners/success_banner";
import { ErrorBanner } from "../banners/error_banner";

export const EditRowSlideOver = ({ onEditRow }) => {
  const { table } = useParams();
  const { editRow, setEditRow } = React.useContext(SidebarContext);
  const [columnName, setColumnName] = React.useState("");
  // const [tableNameBlur, setTableNameBlur] = React.useState(false);

  const [successBanner, setSuccessBanner] = React.useState(false);
  const [errorBanner, setErrorBanner] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const closeAndResetSlideOver = () => {
    setEditRow(false);
    setErrorBanner(false);
    setSuccessBanner(false);
    // setTableNameBlur(false);
    setColumnName("");
  };
  // const ColumnInputErrorMessage = () => {
  //   if (columnName.length === 0 && tableNameBlur) {
  //     return (
  //       <span className="text-red-600 text-xs">Table name cannot be empty</span>
  //     );
  //   } else if (whiteSpace(columnName) && tableNameBlur) {
  //     return (
  //       <span className="text-red-600 text-xs">
  //         Table name cannot contain spaces
  //       </span>
  //     );
  //   } else if (columnName.length > 31) {
  //     return (
  //       <span className="text-red-600 text-xs">
  //         Table name cannot be more than 31 chars
  //       </span>
  //     );
  //   } else if (!validTableName(columnName) && tableNameBlur) {
  //     return (
  //       <span className="text-red-600 text-xs">
  //         Project name must start with (a-z) or (_) & only contains (a-z), (0-9)
  //         and (_).
  //       </span>
  //     );
  //   } else {
  //     <span className="opacity-0">hidden</span>;
  //   }
  // };

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
                      <SuccessBanner message={"Row successfully edited!"} />
                    ) : null}
                    {errorBanner ? <ErrorBanner error={errorMessage} /> : null}
                  </div>
                  <form
                    className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSuccessBanner(false);
                      setErrorBanner(false);
                      closeAndResetSlideOver();
                      onEditRow();
                    }}
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
                            Edit row in {table} table.
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="divide-y divide-gray-200 px-4 sm:px-6">
                          <div className="space-y-6 pb-5 pt-6">
                            <div>
                              <label
                                htmlFor="project-name"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Table name
                              </label>
                              <div className="mt-2">
                                <input
                                  type="text"
                                  name="project-name"
                                  id="project-name"
                                  value={columnName}
                                  onChange={(e) =>
                                    setColumnName(e.target.value)
                                  }
                                  // onBlur={() => setTableNameBlur(true)}
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {/* <ColumnInputErrorMessage /> */}
                              </div>
                            </div>
                          </div>
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
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Edit Row
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
