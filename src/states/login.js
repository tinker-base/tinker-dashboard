import React from "react";

export const LoginContext = React.createContext();

export const LoggedIn = ({ children }) => {
  const [login, setLogin] = React.useState(false);
  return (
    <LoginContext.Provider value={{ login, setLogin }}>
      {children}
    </LoginContext.Provider>
  );
};
