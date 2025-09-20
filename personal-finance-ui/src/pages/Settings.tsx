import React from 'react'
import Card from '../components/Card'

export default function Settings() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <Card>
        <p className="text-sm text-gray-600">Account and application settings. Configure OAuth provider or API base URL for production here.</p>
      </Card>
    </div>
  )
}
