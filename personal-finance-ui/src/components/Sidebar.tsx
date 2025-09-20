import React from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="w-64 hidden lg:block border-r bg-white">
      <div className="p-4">
        <nav className="flex flex-col gap-2 text-gray-700">
          <Link to="/" className="py-2 px-3 rounded hover:bg-gray-100">Dashboard</Link>
          <Link to="/accounts" className="py-2 px-3 rounded hover:bg-gray-100">Accounts</Link>
          <Link to="/transactions" className="py-2 px-3 rounded hover:bg-gray-100">Transactions</Link>
          <Link to="/categories" className="py-2 px-3 rounded hover:bg-gray-100">Categories</Link>
          <Link to="/budgets" className="py-2 px-3 rounded hover:bg-gray-100">Budgets</Link>
          <Link to="/reports" className="py-2 px-3 rounded hover:bg-gray-100">Reports</Link>
          <Link to="/settings" className="py-2 px-3 rounded hover:bg-gray-100">Settings</Link>
        </nav>
      </div>
    </aside>
  )
}
