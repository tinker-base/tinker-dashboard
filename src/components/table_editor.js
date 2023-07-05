export const TableEditor = ({ rows }) => {
  if (rows.length > 0) {
    const columns = Object.keys(rows[0]);

    return (
      <div
        className={`w-full grid grid-cols-${columns.length} overflow-auto content-start text-xs`}
      >
        {columns.map((column, index) => (
          <div
            key={column}
            className={`col-start-${
              index + 1
            } p-2 border-solid border-b-2 border-r-2 border-indigo-200 h-min`}
          >
            <p>{column}</p>
          </div>
        ))}

        {rows.map((row) => {
          return columns.map((column, index) => (
            <div
              key={"id" + row.id + column + row[column]}
              className={`col-start-${
                index + 1
              } p-2 border-solid border-b-2 border-r-2 border-indigo-100 h-min`}
            >
              <p className="truncate">{String(row[column])}</p>
            </div>
          ));
        })}
      </div>
    );
  } else {
    return <span className="w-full p-3 text-center">Select Table</span>;
  }
};
