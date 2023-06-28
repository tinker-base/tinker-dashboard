import { Tables } from "./tables";
import { Rows } from "./rows";

export const TableEditor = ({ schemas, tables, rows, onClick }) => {
  return (
    <>
      <Tables schemas={schemas} tables={tables} onClick={onClick} />
      <Rows rows={rows} />
    </>
  );
};
