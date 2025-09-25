import React, { useState } from 'react'
import api from '../services/api'
import dayjs from 'dayjs'
import { formatCurrency } from '@/utils/currency'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts'

export default function Reports() {
  const [from, setFrom] = useState(dayjs().startOf('month').format('YYYY-MM-DD'))
  const [to, setTo] = useState(dayjs().format('YYYY-MM-DD'))
  const [summary, setSummary] = useState<any>(null)
  const [timeseries, setTimeseries] = useState<any[]>([])

  const load = async () => {
    try {
      const res = await api.get('/reports/summary', { params: { from, to } })
      setSummary(res.data)
      // Try to fetch timeseries if available
      const tsRes = await api.get('/reports/timeseries', { params: { from, to } }).catch(() => null)
      setTimeseries(tsRes?.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
          <p className="mt-1 text-sm text-gray-600">Run financial reports and visualise income vs expense for a date range.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-1">
            <label className="text-xs text-gray-500">From</label>
            <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="text-sm" />
          </div>

          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-1">
            <label className="text-xs text-gray-500">To</label>
            <input type="date" value={to} onChange={e => setTo(e.target.value)} className="text-sm" />
          </div>

          <button onClick={load} className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700">Run</button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500">Income</div>
          <div className="text-2xl font-semibold text-gray-900">{formatCurrency(summary?.income || 0, '')}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500">Expense</div>
          <div className="text-2xl font-semibold text-gray-900">{formatCurrency(summary?.expense || 0, '')}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500">Net</div>
          <div className="text-2xl font-semibold text-gray-900">{formatCurrency(summary?.net || 0, '')}</div>
        </div>
      </div>

      {/* Charts and details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-800 mb-3">Income / Expense over time</h3>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeseries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-800 mb-3">Top categories</h3>
          {summary?.topCategories?.length ? (
            <ul className="space-y-3">
              {summary.topCategories.map((c: any) => (
                <li key={c.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700">{(c.name || '').slice(0,2).toUpperCase()}</div>
                    <div>
                      <div className="text-sm text-gray-900">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.count} transactions</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">{formatCurrency(c.total, '')}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-500">No category data</div>
          )}
        </div>
      </div>
    </div>
  )
}
