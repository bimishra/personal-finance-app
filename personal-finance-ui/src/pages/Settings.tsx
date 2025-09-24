import React from 'react';
import { CurrencySettings } from '@/features/settings/CurrencySettings';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your application preferences and account settings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <CurrencySettings />
      </div>
    </div>
  )
}
