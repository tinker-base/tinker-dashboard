import React, { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

const datatypes = [
  { id: 0, type: "-", desc: "" },
  { id: "serial", type: "serial", desc: "SQL generated sequential ints" },
  { id: "int2", type: "int2", desc: "Signed two-byte integer" },
  { id: "int4", type: "int4", desc: "Signed four-byte integer" },
  { id: "int8", type: "int8", desc: "Signed eight-byte integer" },
  {
    id: "float4",
    type: "float4",
    desc: "Single precision floating-point number (4 bytes)",
  },
  {
    id: "float8",
    type: "float8",
    desc: "Double precision floating-point number (8 bytes)",
  },
  {
    id: "numeric",
    type: "numeric",
    desc: "Exact numeric of selectable precision",
  },
  { id: "json", type: "json", desc: "Textual JSON data" },
  { id: "jsonb", type: "jsonb", desc: "Binary JSON data, decomposed" },
  { id: "text", type: "text", desc: "Variable-length character string" },
  { id: "varchar", type: "varchar", desc: "Variable-length character string" },
  { id: "uuid", type: "uuid", desc: "Universally unique identifier" },
  { id: "date", type: "date", desc: "Calendar date (year, month, day" },
  { id: "time", type: "time", desc: "Time of day (no time zone)" },
  { id: "timetz", type: "timetz", desc: "Time of day, including time zone" },
  { id: "timestamp", type: "timestamp", desc: "Date and time (no time zone)" },
  {
    id: "timestamptz",
    type: "timestamptz",
    desc: "Date and time, including time zone",
  },
  { id: "bool", type: "bool", desc: "Logical boolean (true/false)" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const DataTypeSelect = ({ id, onColInputChange }) => {
  const [selected, setSelected] = useState(datatypes[0]);

  // React.useEffect(() => {
  //   if (type) {
  //     const index = datatypes.findIndex((data) => data.type === type);
  //     setSelected(datatypes[index]);
  //   }
  // }, []);

  return (
    <Listbox
      value={selected}
      name="type"
      onChange={(e) => {
        setSelected(e);
        onColInputChange(id, { target: { name: "type", value: e.type } });
      }}
    >
      {({ open }) => (
        <>
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
              <span className="block truncate">{selected.type}</span>
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
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {datatypes.map((data) => (
                  <Listbox.Option
                    key={data.id}
                    name="type"
                    className={({ active }) =>
                      classNames(
                        active ? "bg-indigo-600 text-white" : "text-gray-900",
                        "relative cursor-default select-none py-2 px-2"
                      )
                    }
                    value={data}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={"font-semibold inline-block truncate"}>
                          {data.type}
                        </span>
                        <span className="block text-xs">{data.desc}</span>
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
