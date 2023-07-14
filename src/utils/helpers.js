export const validTableName = (name) => {
  if (whiteSpace(name) || name.length === 0) return false;
  // const match = name.match(/^[a-zA-Z][a-zA-Z0-9-]+$/g);
  // if (!match) {
  //   return false;
  // }
  // return match[0] === name;
  const regex = /^[a-zA-Z_][a-zA-Z0-9_]*$/g;
  return regex.test(name);
};

export const whiteSpace = (name) => {
  const trimmed = name.replace(" ", "");
  return trimmed !== name;
};
