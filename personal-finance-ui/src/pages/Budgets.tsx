import React from 'react'
import Card from '../components/Card'

export default function Budgets() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Budgets</h1>
      <Card>
        <p className="text-sm text-gray-600">Monthly budgets with progress bars and alerts when overspent.</p>
      </Card>
    </div>
  )
}
