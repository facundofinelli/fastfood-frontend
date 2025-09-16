import React from "react";

type Column<T> = {
  key: keyof T | "actions";
  header: string;
  render?: (item: T) => React.ReactNode;
};

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
};

export function Table<T>({ data, columns }: TableProps<T>) {
  return (
    <table className="min-w-full border border-gray-300 rounded-lg">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)} className="px-4 py-2 text-left border-b">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="hover:bg-gray-50">
            {columns.map((col) => (
              <td key={String(col.key)} className="px-4 py-2 border-b">
                {col.render ? col.render(row) : (row[col.key as keyof T] as any)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
