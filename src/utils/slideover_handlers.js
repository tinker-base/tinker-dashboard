import React from "react";
import { SidebarContext } from "../states/sidebar_states";

export const ToggleAddTableSlideOver = () => {
  const { addTable, setAddTable } = React.useContext(SidebarContext);
  return () => setAddTable(!addTable);
};
export const ToggleAddRowSlideOver = () => {
  const { addRow, setAddRow } = React.useContext(SidebarContext);
  return () => setAddRow(!addRow);
};
