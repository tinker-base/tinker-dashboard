export const validProjectName = (projectName) => {
  if (whiteSpace(projectName)) return false;
  const match = projectName.match(/^[a-zA-Z][a-zA-Z0-9-]+$/g);
  if (!match) {
    return false;
  }
  return match[0] === projectName;
};

export const whiteSpace = (projectName) => {
  const trimmed = projectName.replace(" ", "");
  if (trimmed === projectName) {
    return false;
  }
  return true;
};
