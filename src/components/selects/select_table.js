import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const SelectTable = ({ tables, selectedTable, setSelectedTable }) => {
  return (
    <Listbox
      value={selectedTable}
      onChange={(value) => {
        setSelectedTable(value);
      }}
    >
      {({ open }) => (
        <>
          <Listbox.Label className="block text-xs font-medium leading-6 text-inherit mt-4">
            Table
          </Listbox.Label>
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-xs leading-3">
              <span className="block truncate">{selectedTable}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-xs leading-3">
                {tables.map(({ table_name }, index) => (
                  <Listbox.Option
                    key={table_name + index}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-indigo-300 text-white" : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-8 pr-4"
                      )
                    }
                    value={table_name}
                  >
                    {({ selectedTable, active }) => (
                      <>
                        <span
                          className={classNames(
                            selectedTable ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {table_name}
                        </span>

                        {selectedTable ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 left-0 flex items-center pl-1.5"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};
