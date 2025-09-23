import React from 'react'
import { Category } from '@/types'

interface Props {
  categories: Category[]
}

export default function CategoriesTable({ categories }: Props) {
  return (
    <div className="bg-white rounded shadow">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Type</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(c => (
            <tr key={c.id} className="border-t">
              <td className="px-3 py-2">{c.name}</td>
                <td className="px-3 py-2">{c.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
