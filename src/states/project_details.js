import React from "react";

export const ProjectDataContext = React.createContext();

export const ProjectData = ({ children }) => {
  const [jwt, setJWT] = React.useState();
  const [projectURL, setProjectURL] = React.useState("");

  return (
    <ProjectDataContext.Provider
      value={{
        projectURL,
        setProjectURL,
        jwt,
        setJWT,
      }}
    >
      {children}
    </ProjectDataContext.Provider>
  );
};
