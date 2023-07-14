import React from "react";

export const ShowModalContext = React.createContext();

export const ShowModalStates = ({ children }) => {
  const [deleteTable, setDeleteTable] = React.useState(false);

  return (
    <ShowModalContext.Provider
      value={{
        deleteTable,
        setDeleteTable,
      }}
    >
      {children}
    </ShowModalContext.Provider>
  );
};
