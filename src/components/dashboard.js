import React from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router";
import { Tables } from "./tables";
import { NewProjectSlideOver } from "./new_project_modal";
import { SidebarContext } from "../states/sidebar_states";
import { LoginContext } from "../states/login";
import { useSignOut } from "../utils/custom_hooks/signOut";

const navigation = [
  {
    name: "Projects",
    href: "/dashboard/projects",
    icon: FolderIcon,
    current: true,
  },
  { name: "Users", href: "/dashboard/users", icon: UsersIcon, current: false },
];
const teams = [
  { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
  { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
  { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SidebarNav = () => {
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
        <a
          href="/dashboard"
          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
        >
          <Cog6ToothIcon
            className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
            aria-hidden="true"
          />
          Settings
        </a>
      </li>
    </ul>
  );
};

export const Dashboard = ({
  username,
  schemas,
  tables,
  onTableSelect,
  onCreateNewProject,
}) => {
  const navigate = useNavigate();
  const { login } = React.useContext(LoginContext);
  const { dashboardNavOpen, setDashboardNavOpen } =
    React.useContext(SidebarContext);
  const signOut = useSignOut();
  const { project } = useParams();

  const userNavigation = [
    { name: "Your profile", href: () => {} },
    { name: "Sign out", href: signOut },
  ];

  React.useEffect(() => {
    if (!login) {
      navigate("/login");
    }
  });
  return (
    <>
      <div>
        <NewProjectSlideOver onCreateNewProject={onCreateNewProject} />
        <Transition.Root show={dashboardNavOpen} as={React.Fragment}>
          <Dialog
            as="div"
            // className={`relative z-50 lg:hidden`}
            className={`relative z-50 ${project ? "" : "lg:hidden"}`}
            onClose={setDashboardNavOpen}
          >
            <Transition.Child
              as={React.Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500/50" />
            </Transition.Child>

            <div id="toggling-sidebar-wrapper" className="fixed inset-0 flex">
              <Transition.Child
                as={React.Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={React.Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-1/2 top-0 flex w-10 justify-center pt-5 ">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setDashboardNavOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>

                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div
                    id="toggling-sidebar"
                    className="flex w-48 flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4"
                  >
                    <div className="flex h-16 shrink-0 items-center">
                      <h1 className="text-white text-2xl">TINKER</h1>
                    </div>
                    <nav className="flex flex-1 flex-col">
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
                          <a
                            href="/dashboard"
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
                          >
                            <Cog6ToothIcon
                              className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
                              aria-hidden="true"
                            />
                            Settings
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div
          id="static-sidebar-wrapper"
          // className={`${
          // project ? "hidden" : "hidden lg:flex"
          // } lg:fixed lg:inset-y-0 lg:z-50  lg:w-48 lg:flex-col `}
          className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-48 lg:flex-col"
        >
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div
            id="static-sidebar"
            className="flex flex-col h-full gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4"
          >
            <div className="flex h-16 shrink-0 items-center">
              <h1 className="text-white text-2xl">TINKER</h1>
              {/* <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=white"
                alt="Your Company"
              /> */}
            </div>
            <nav className="flex flex-1 flex-col">
              {project ? (
                <Tables
                  schemas={schemas}
                  tables={tables}
                  onTableSelect={onTableSelect}
                />
              ) : (
                <SidebarNav />
              )}
            </nav>
          </div>
        </div>

        <div className="lg:pl-48">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className={`-m-2.5 p-2.5 text-gray-700 ${
                project ? "" : "hidden"
              }`}
              // className={`-m-2.5 p-2.5 text-gray-700 lg:hidden`}
              onClick={() => setDashboardNavOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div
              className="h-6 w-px bg-gray-900/10 lg:hidden"
              aria-hidden="true"
            />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="relative flex flex-1"></div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Separator */}
                <div
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                  aria-hidden="true"
                />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <Menu.Button className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    {/* <img
                      className="h-8 w-8 rounded-full bg-gray-50"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    /> */}
                    <span className="hidden lg:flex lg:items-center">
                      <span
                        className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                        aria-hidden="true"
                      >
                        {username}
                      </span>
                      <ChevronDownIcon
                        className="ml-2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Menu.Button>
                  <Transition
                    as={React.Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
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
                </Menu>
              </div>
            </div>
          </div>

          <main className="py-10">
            <div className="px-4">{<Outlet />}</div>
          </main>
        </div>
      </div>
    </>
  );
};
