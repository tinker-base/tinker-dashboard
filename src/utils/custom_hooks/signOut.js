import React from "react";
import { LoginContext } from "../../states/login";
import { useNavigate } from "react-router";

export const useSignOut = () => {
  const navigate = useNavigate();
  const { setLogin } = React.useContext(LoginContext);
  return () => {
    sessionStorage.clear();
    navigate("/login");
    setLogin(false);
  };
};
