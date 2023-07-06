import React from "react";

export const SidebarContext = React.createContext();

export const SidebarStates = ({ children }) => {
  const [dashboardNavOpen, setDashboardNavOpen] = React.useState(false);
  const [NewProjectSlideOverOpen, setNewProjectSlideOverOpen] =
    React.useState(false);
  return (
    <SidebarContext.Provider
      value={{
        dashboardNavOpen,
        setDashboardNavOpen,
        NewProjectSlideOverOpen,
        setNewProjectSlideOverOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
