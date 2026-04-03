import type { ReactNode } from 'react';

export interface DataTableColumn<RowData> {
  key: string;
  header: string;
  className?: string;
  renderCell: (row: RowData) => ReactNode;
}

interface DataTableProps<RowData> {
  caption?: string;
  columns: DataTableColumn<RowData>[];
  rows: RowData[];
  getRowKey: (row: RowData, index: number) => string;
  emptyState?: ReactNode;
  className?: string;
}

export function DataTable<RowData>({
  caption,
  columns,
  rows,
  getRowKey,
  emptyState,
  className,
}: DataTableProps<RowData>) {
  if (!rows.length && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className={className}>
      <table className="w-full border-collapse">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`border-b border-[#e5e7eb] px-3 py-2 text-left text-[11px] uppercase tracking-wider text-[#6b7280] ${column.className ?? ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={getRowKey(row, rowIndex)} className="border-b border-[#f3f4f6]">
              {columns.map((column) => (
                <td key={column.key} className={`px-3 py-3 text-[12px] text-[#374151] ${column.className ?? ''}`}>
                  {column.renderCell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
