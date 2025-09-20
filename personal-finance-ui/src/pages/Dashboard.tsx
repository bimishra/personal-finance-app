import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { fetchAccounts } from '../state/slices/countSlice'
import { fetchTransactions } from '../state/slices/transactionsSlice'
import Card from '../components/Card'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import dayjs from 'dayjs'

export default function Dashboard() {
  const dispatch = useAppDispatch()
  const accounts = useAppSelector(s => s.accounts.items)
  const txns = useAppSelector(s => s.transactions.items)

  useEffect(() => {
    dispatch(fetchAccounts())
    dispatch(fetchTransactions())
  }, [dispatch])

  const chartData = txns.slice(0, 12).map(t => ({ date: dayjs(t.txnDate).format('MMM D'), amount: Number(t.amount) }))

  const totalBalance = accounts.reduce((acc, a) => acc + Number(a.balance), 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <Card title="Overview">
          <div className="flex gap-6">
            <div className="w-1/3">
              <div className="text-sm text-gray-500">Total Balance</div>
              <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
            </div>
            <div className="w-2/3">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <div className="mt-6">
          <Card title="Recent Transactions">
            <ul className="divide-y">
              {txns.slice(0, 8).map(t => (
                <li key={t.id} className="py-2 flex justify-between">
                  <div>
                    <div className="font-medium">{t.description || '—'}</div>
                    <div className="text-sm text-gray-500">{t.txnDate}</div>
                  </div>
                  <div className={`font-semibold ${t.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'CREDIT' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <div className="lg:col-span-1">
        <Card title="Accounts">
          <ul>
            {accounts.map(a => (
              <li key={a.id} className="py-2 border-b">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{a.name}</div>
                    <div className="text-sm text-gray-500">{a.currency || 'USD'}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${Number(a.balance).toFixed(2)}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
