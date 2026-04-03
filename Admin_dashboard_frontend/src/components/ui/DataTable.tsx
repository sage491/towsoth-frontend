import type { ReactNode } from 'react';

interface Column<RowData extends Record<string, ReactNode>> {
  key: keyof RowData & string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<RowData extends Record<string, ReactNode>> {
  columns: Column<RowData>[];
  data: RowData[];
  onRowClick?: (row: RowData) => void;
}

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

export function DataTable<RowData extends Record<string, ReactNode>>({
  columns,
  data,
  onRowClick,
}: DataTableProps<RowData>) {
  return (
    <div className="bg-white border border-[#d1d5db]">
      <table className="w-full">
        <thead className="bg-[#f9fafb] border-b border-[#d1d5db]">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-[11px] text-[#6b7280] uppercase tracking-wider ${alignClasses[col.align || 'left']}`}
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-[#e5e7eb] ${onRowClick ? 'cursor-pointer hover:bg-[#f9fafb]' : ''}`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 text-[13px] text-[#374151] ${alignClasses[col.align || 'left']}`}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
