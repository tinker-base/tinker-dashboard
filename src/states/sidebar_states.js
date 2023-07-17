import React from "react";

export const SidebarContext = React.createContext();

export const SidebarStates = ({ children }) => {
  const [dashboardNavOpen, setDashboardNavOpen] = React.useState(false);
  const [addTable, setAddTable] = React.useState(false);
  const [addRow, setAddRow] = React.useState(false);
  const [editRow, setEditRow] = React.useState(false);
  const [rowData, setRowData] = React.useState([]);
  const [columnConstraints, setColumnConstraints] = React.useState([]);
  return (
    <SidebarContext.Provider
      value={{
        dashboardNavOpen,
        setDashboardNavOpen,
        addTable,
        setAddTable,
        addRow,
        setAddRow,
        editRow,
        setEditRow,
        rowData,
        setRowData,
        columnConstraints,
        setColumnConstraints,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
