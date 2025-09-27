import React from 'react'
import styles from './Table.module.css'

export default function Table<T>({ columns, data }: { columns: { key: keyof T | string; label: string; render?: (row: T) => React.ReactNode }[]; data: T[] }) {
  return (
    <table className={styles.table}>
      <thead className={styles.thead}>
        <tr>
          {columns.map(col => (
            <th key={String(col.key)} className={styles.th}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody className={styles.tbody}>
        {data.map((row, idx) => (
          <tr key={idx} className={styles.trHover}>
            {columns.map(col => (
              <td key={String(col.key)} className={styles.td}>
                {col.render ? col.render(row) : (row as any)[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
