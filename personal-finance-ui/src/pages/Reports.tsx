import React, { useState } from 'react'
import api from '../services/api'
import { useAppDispatch } from '../state/hooks'
import dayjs from 'dayjs'

export default function Reports() {
  const [from, setFrom] = useState(dayjs().startOf('month').format('YYYY-MM-DD'))
  const [to, setTo] = useState(dayjs().format('YYYY-MM-DD'))
  const [summary, setSummary] = useState<any>(null)

  const load = async () => {
    const res = await api.get('/reports/summary', { params: { from, to } })
    setSummary(res.data)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="flex gap-2 mb-4">
        <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border p-2 rounded" />
        <input type="date" value={to} onChange={e => setTo(e.target.value)} className="border p-2 rounded" />
        <button onClick={load} className="bg-indigo-600 text-white px-4 py-2 rounded">Run</button>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Income</div>
            <div className="text-2xl font-bold">${summary.income.toFixed(2)}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Expense</div>
            <div className="text-2xl font-bold">${summary.expense.toFixed(2)}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Net</div>
            <div className="text-2xl font-bold">${summary.net.toFixed(2)}</div>
          </div>
        </div>
      )}
    </div>
  )
}
