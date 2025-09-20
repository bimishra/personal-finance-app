import React from 'react'
import Card from '../components/Card'

export default function Categories() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <Card>
        <p className="text-sm text-gray-600">Manage income and expense categories here. (CRUD UI can be implemented similar to Accounts)</p>
      </Card>
    </div>
  )
}
