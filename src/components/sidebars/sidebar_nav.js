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
const teams = [
  // { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
  // { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
  // { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const SidebarNav = () => {
  const signOut = useSignOut();

  const userNavigation = [
    { name: "Your profile", href: () => {} },
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
      <li>
        <div className="text-xs font-semibold leading-6 text-indigo-200">
          Your teams
        </div>
        <ul className="-mx-2 mt-2 space-y-1">
          {teams.map((team) => (
            <li key={team.name}>
              <a
                href={team.href}
                className={classNames(
                  team.current
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-200 hover:text-white hover:bg-indigo-700",
                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                )}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
                  {team.initial}
                </span>
                <span className="truncate">{team.name}</span>
              </a>
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
                        "block px-3 py-1 text-sm leading-6 text-gray-900"
                      )}
                    >
                      {item.name}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
          <Menu.Button className="-m-1.5 flex items-center p-1.5">
            <span className="sr-only">Open user menu</span>
            <span className=" flex items-center">
              <span className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white">
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
