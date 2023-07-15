import React from "react";

export const ShowModalContext = React.createContext();

export const ShowModalStates = ({ children }) => {
  const [showDeleteTable, setShowDeleteTable] = React.useState(false);

  return (
    <ShowModalContext.Provider
      value={{
        showDeleteTable,
        setShowDeleteTable,
      }}
    >
      {children}
    </ShowModalContext.Provider>
  );
};
