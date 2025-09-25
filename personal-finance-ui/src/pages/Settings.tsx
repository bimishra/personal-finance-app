import React, { useState } from 'react';
import { CurrencySettings } from '@/features/settings/CurrencySettings';

export default function Settings() {
  const [active, setActive] = useState<'general' | 'currency' | 'notifications'>('currency');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-600">Manage your application preferences and account settings.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm hover:bg-gray-50">Reset to defaults</button>
          <button className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">Save changes</button>
        </div>
      </div>

      {/* Content with left navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4">
          {/* Left nav */}
          <nav aria-label="Settings navigation" className="border-r border-gray-100 p-4 md:p-6">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActive('general')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${active === 'general' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  General
                </button>
              </li>

              <li>
                <button
                  onClick={() => setActive('currency')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${active === 'currency' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Currency
                </button>
              </li>

              <li>
                <button
                  onClick={() => setActive('notifications')}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${active === 'notifications' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Notifications
                </button>
              </li>
            </ul>
          </nav>

          {/* Main content */}
          <div className="md:col-span-3 p-4 md:p-6">
            {active === 'currency' && (
              <section>
                <CurrencySettings />
              </section>
            )}

            {active === 'general' && (
              <section aria-labelledby="general-heading">
                <h2 id="general-heading" className="text-lg font-medium text-gray-900 mb-4">General</h2>
                <div className="text-sm text-gray-600">Application-wide settings such as language, timezone and startup preferences will appear here.</div>
              </section>
            )}

            {active === 'notifications' && (
              <section aria-labelledby="notifications-heading">
                <h2 id="notifications-heading" className="text-lg font-medium text-gray-900 mb-4">Notifications</h2>
                <div className="text-sm text-gray-600">Configure notification preferences (email, push, reminders) here.</div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
