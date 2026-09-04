import type { HTMLAttributes, ReactNode } from "react";

interface DataTableColumn<T> {
  key: string;
  header: string;
  align?: "left" | "right";
  render: (row: T, index: number) => ReactNode;
}

interface DataTableProps<T> extends HTMLAttributes<HTMLTableElement> {
  columns: DataTableColumn<T>[];
  data: T[];
  onRowClick?: (row: T, index: number) => void;
}

export function DataTable<T>({
  columns,
  data,
  onRowClick,
  className,
  ...rest
}: DataTableProps<T>) {
  return (
    <div className="s-data-table-wrap">
      <table
        className={["s-data-table", className].filter(Boolean).join(" ")}
        {...rest}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                style={{ textAlign: col.align === "right" ? "right" : "left" }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              onClick={onRowClick ? () => onRowClick(row, i) : undefined}
              className={onRowClick ? "s-data-table__row--clickable" : undefined}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  data-label={col.header}
                  style={{ textAlign: col.align === "right" ? "right" : "left" }}
                >
                  {col.render(row, i)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
