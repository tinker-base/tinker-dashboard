import { Tables } from "./tables";
import { Rows } from "./rows";

export const TableEditor = ({ schemas, tables, rows, onClick }) => {
  return (
    <div className="flex h-5/6">
      <Tables schemas={schemas} tables={tables} onClick={onClick} />
      <Rows rows={rows} />
    </div>
  );
};
