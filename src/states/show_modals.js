import React from "react";

export const ShowModalContext = React.createContext();

export const ShowModalStates = ({ children }) => {
  const [showDeleteTable, setShowDeleteTable] = React.useState(false);
  const [showDeleteRow, setShowDeleteRow] = React.useState(false);
  const [showDeleteColumn, setShowDeleteColumn] = React.useState(false);

  return (
    <ShowModalContext.Provider
      value={{
        showDeleteTable,
        setShowDeleteTable,
        showDeleteRow,
        setShowDeleteRow,
        showDeleteColumn,
        setShowDeleteColumn,
      }}
    >
      {children}
    </ShowModalContext.Provider>
  );
};
