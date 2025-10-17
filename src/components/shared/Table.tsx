import React, { useState, useEffect } from "react";
import { MoreVertical } from "lucide-react";

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
  const [openRow, setOpenRow] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".actions-menu")) {
        setOpenRow(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded-lg relative">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-2 text-left border-b whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 relative">
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className="px-4 py-2 border-b text-left whitespace-nowrap"
                >
                  {col.key === "actions" ? (
                    <div className="relative inline-block actions-menu">
                      <button
                        className="p-1 rounded hover:bg-gray-200"
                        onClick={() => setOpenRow(openRow === i ? null : i)}
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                      {openRow === i && (
                        <div className="fixed mt-2 w-32 bg-white border rounded shadow-lg z-10 text-sm">
                          <div className="flex flex-col text-left">
                            {col.render && col.render(row)}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : col.render ? (
                    col.render(row)
                  ) : (
                    (row[col.key as keyof T] as any)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
