import React from "react";
import { LoginContext } from "../../states/login";

export const useSignOut = () => {
  const { setLogin } = React.useContext(LoginContext);
  return () => setLogin(false);
};
