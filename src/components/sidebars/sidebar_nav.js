import React from "react";
import { useSignOut } from "../../utils/custom_hooks/signOut";
import { Menu, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import {
  Cog6ToothIcon,
  FolderIcon,
  // UsersIcon,
} from "@heroicons/react/24/outline";
const navigation = [
  {
    name: "Projects",
    href: "/dashboard/projects",
    icon: FolderIcon,
    current: true,
  },
  // { name: "Users", href: "/dashboard/users", icon: UsersIcon, current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const SidebarNav = () => {
  const signOut = useSignOut();

  const userNavigation = [
    // { name: "Your profile", href: () => {} },
    { name: "Sign out", href: signOut },
  ];

  return (
    <ul className="flex flex-1 flex-col gap-y-7">
      <li>
        <ul className="-mx-2 space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={classNames(
                  item.current
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-200 hover:text-white hover:bg-indigo-700",
                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                )}
              >
                <item.icon
                  className={classNames(
                    item.current
                      ? "text-white"
                      : "text-indigo-200 group-hover:text-white",
                    "h-6 w-6 shrink-0"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </li>

      <li className="mt-auto">
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
      </li>
    </ul>
  );
};
