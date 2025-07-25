import React from "react";

type Column<T> = {
  header: string;
  /** Optional cell renderer; if omitted, data[field] is shown */
  accessor?: keyof T;
  /** Custom cell render function */
  render?: (item: T) => React.ReactNode;
  /** Tailwind class for this column */
  className?: string;
};

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
}

export default function Table<T>({ columns, data }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-700">
        <thead className="bg-slate-800 text-slate-100">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={
                  `px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ` +
                  (col.className || "")
                }
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-slate-800 divide-y divide-slate-700 text-slate-100">
          {data.map((item, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-slate-700">
              {columns.map((col, colIdx) => (
                <td
                  key={colIdx}
                  className={`px-4 py-2 whitespace-nowrap text-sm text-gray-700 ` +
                    (col.className || "")}
                >
                  {col.render
                    ? col.render(item)
                    : col.accessor
                    ? String(item[col.accessor])
                    : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

