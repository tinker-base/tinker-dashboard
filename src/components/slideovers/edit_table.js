import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { SidebarContext } from "../../states/sidebar_states";
import { validTableName, whiteSpace } from "../../utils/helpers";
import { SuccessBanner } from "../banners/success_banner";
import { ErrorBanner } from "../banners/error_banner";
import { FunctionContexts } from "../../utils/fetch_handlers";

export const EditTableSlideOver = () => {
  const { showEditTable, setShowEditTable } = React.useContext(SidebarContext);
  const {
    handleEditTable,
    selectedTable,
    tableDescription,
    editTableDescription,
    selectedSchema,
  } = React.useContext(FunctionContexts);

  const [formData, setFormData] = React.useState({});
  const [blurs, setBlurs] = React.useState({ name: false, description: false });
  const [validForm, setValidForm] = React.useState(false);
  const [successBanner, setSuccessBanner] = React.useState(false);
  const [errorBanner, setErrorBanner] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    setFormData({
      name: selectedTable,
      description: tableDescription,
    });
  }, [showEditTable]);

  React.useEffect(() => {
    validateForm();
  }, [formData]);

  const nameData = () => {
    return {
      schema_name: selectedSchema,
      new_table_name: formData.name,
      old_table_name: selectedTable,
    };
  };

  const closeAndResetSlideOver = () => {
    setShowEditTable(false);
    setBlurs({ name: false, description: false });
    setFormData({ name: "", description: "" });
    setErrorBanner(false);
    setSuccessBanner(false);
  };

  const validateForm = () => {
    if (formData.name && validTableName(formData.name)) {
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

  const formatDescription = () => {
    return {
      p_schema_name: selectedSchema,
      p_table_name: formData.name,
      new_description: formData.description,
    };
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setSuccessBanner(false);
    setErrorBanner(false);

    const response = await handleEditTable(nameData());
    const res = await editTableDescription(formatDescription());

    if (res === true) {
      setSuccessBanner(true);
      setTimeout(() => {
        closeAndResetSlideOver();
      }, 1000);
    } else if (res.message) {
      setErrorMessage(res.message);
      setErrorBanner(true);
    }
    if (response === true) {
      setSuccessBanner(true);
      setTimeout(() => {
        closeAndResetSlideOver();
      }, 1000);
    } else if (response.message) {
      setErrorMessage(response.message);
      setErrorBanner(true);
    }
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
          Project name must start with (a-z) or (_) & only contains (a-z), (0-9)
          and (_).
        </span>
      );
    } else {
      return <span className="opacity-0">hidden</span>;
    }
  };

  return (
    <>
      <Transition.Root show={showEditTable} as={React.Fragment}>
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
                        <SuccessBanner
                          message={"Table successfully updated!"}
                        />
                      ) : null}
                      {errorBanner ? (
                        <ErrorBanner error={errorMessage} />
                      ) : null}
                    </div>
                    <form
                      className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
                      onSubmit={(e) => onSubmitForm(e)}
                    >
                      <div className="h-0 flex-1 overflow-y-auto">
                        <div className="bg-indigo-700 px-4 py-6 sm:px-6">
                          <div className="flex items-center justify-between">
                            <Dialog.Title className="text-base font-semibold leading-6 text-white">
                              Edit Table
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
                              Edit the name and description of the table.
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
    </>
  );
};
