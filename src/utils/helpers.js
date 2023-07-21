export const validTableName = (name) => {
  if (whiteSpace(name) || name.length === 0) return false;
  const regex = /^[a-z_][a-z0-9_]*$/g;
  return regex.test(name);
};

export const whiteSpace = (name) => {
  const trimmed = name.replace(" ", "");
  return trimmed !== name;
};
