import React from 'react'

export default function Table<T>({ columns, data }: { columns: { key: keyof T | string; label: string; render?: (row: T) => React.ReactNode }[]; data: T[] }) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map(col => (
            <th key={String(col.key)} className="px-4 py-2 text-left text-sm font-medium text-gray-500">{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((row, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            {columns.map(col => (
              <td key={String(col.key)} className="px-4 py-2 text-sm text-gray-700">
                {col.render ? col.render(row) : (row as any)[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
