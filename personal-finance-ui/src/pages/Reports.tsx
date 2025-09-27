import React, { useEffect, useState } from 'react'
import api from '../services/api'
import dayjs from 'dayjs'
import { formatCurrency } from '@/utils/currency'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts'
import styles from './Reports.module.css'

export default function Reports() {
  const [from, setFrom] = useState(dayjs().startOf('month').format('YYYY-MM-DD'))
  const [to, setTo] = useState(dayjs().format('YYYY-MM-DD'))
  const [summary, setSummary] = useState<any>(null)
  const [timeseries, setTimeseries] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/reports/summary', { params: { from, to } })
      setSummary(res.data)

      // Try to fetch timeseries if available
      const tsRes = await api.get('/reports/timeseries', { params: { from, to } }).catch(() => null)
      const ts = tsRes?.data

      // Normalize several possible shapes into an array of { date, ...values }
      let parsed: any[] = []

      if (!ts) {
        parsed = []
      } else if (Array.isArray(ts)) {
        // Already an array of points
        parsed = ts

      // New API shape: top-level income/expense objects mapping date -> value
      } else if ((ts.income && typeof ts.income === 'object') || (ts.expense && typeof ts.expense === 'object')) {
        const incomeObj = ts.income || {}
        const expenseObj = ts.expense || {}

        // Build a full date range to ensure consistent x-axis (use response bounds if provided else page state)
        const startDate = ts.from || from
        const endDate = ts.to || to
        const dates: string[] = []
        let cur = dayjs(startDate)
        const endD = dayjs(endDate)
        while (cur.isBefore(endD) || cur.isSame(endD, 'day')) {
          dates.push(cur.format('YYYY-MM-DD'))
          cur = cur.add(1, 'day')
        }

        parsed = dates.map((d) => ({
          date: d,
          income: Number(incomeObj[d] ?? 0),
          expense: Number(expenseObj[d] ?? 0),
        }))

      } else if (ts.series && typeof ts.series === 'object') {
        const series = ts.series

        // Case 1: nested income/expense series: { income: {date: val}, expense: {date: val} }
        if (series.income && typeof series.income === 'object' && series.expense && typeof series.expense === 'object') {
          const dates = new Set<string>([...Object.keys(series.income), ...Object.keys(series.expense)])
          parsed = Array.from(dates).sort().map((d) => ({
            date: d,
            income: series.income[d] ?? 0,
            expense: series.expense[d] ?? 0,
          }))

        // Case 2: single numeric series mapping date -> value: { "2025-09-01": 0 }
        } else {
          parsed = Object.entries(series).map(([d, v]) => ({ date: d, value: typeof v === 'number' ? v : Number(v) || 0 }))
          // Ensure chronological order
          parsed.sort((a, b) => (a.date > b.date ? 1 : -1))
        }
      } else if (typeof ts === 'object') {
        // Fallback: try to interpret object with dates as keys but ignore known metadata keys
        const excluded = new Set(['from', 'to', 'income', 'expense', 'series'])
        parsed = Object.entries(ts)
          .filter(([k]) => !excluded.has(k))
          .map(([d, v]) => ({ date: d, value: typeof v === 'number' ? v : Number(v) || 0 }))
        parsed.sort((a, b) => (a.date > b.date ? 1 : -1))
      }

      setTimeseries(parsed)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Auto load on mount
  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Reports</h1>
          <p className={styles.subtitle}>Run financial reports and visualise income vs expense for a date range.</p>
        </div>

        <div className={styles.controls}>
          <div className={styles.dateGroup}>
            <label className={styles.dateLabel}>From</label>
            <input type="date" value={from} onChange={e => setFrom(e.target.value)} className={styles.dateInput} />
          </div>

          <div className={styles.dateGroup}>
            <label className={styles.dateLabel}>To</label>
            <input type="date" value={to} onChange={e => setTo(e.target.value)} className={styles.dateInput} />
          </div>

          <button onClick={load} className={styles.runBtn}>Run</button>
        </div>
      </div>

      {/* Summary cards */}
      <div className={styles.summaryGrid}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Income</div>
          <div className={styles.cardValue}>{formatCurrency(summary?.income || 0, '')}</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>Expense</div>
          <div className={styles.cardValue}>{formatCurrency(summary?.expense || 0, '')}</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>Net</div>
          <div className={styles.cardValue}>{formatCurrency(summary?.net || 0, '')}</div>
        </div>
      </div>

      {/* Charts and details */}
      <div className={styles.chartsGrid}>
        <div className={styles.colSpan2 + ' ' + styles.card}>
          <h3 className={styles.sectionTitle}>Income / Expense over time</h3>
          <div className={styles.chartWrapper}>
            {loading ? (
              <div className={styles.chartEmpty}>Loading chart…</div>
            ) : timeseries.length === 0 ? (
              <div className={styles.chartEmpty}>No timeseries data for the selected date range.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeseries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(d) => dayjs(d).format('MMM D')}
                    padding={{ left: 8, right: 8 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: any, name: string) => {
                      // Format numbers as currency when appropriate
                      if (typeof value === 'number') return [formatCurrency(value, ''), name || 'Value']
                      return [value, name]
                    }}
                    labelFormatter={(label: any) => (label ? dayjs(label).format('YYYY-MM-DD') : label)}
                  />
                  <Legend />

                  {/* Render either income/expense lines or a single value line depending on the data shape */}
                  {('income' in timeseries[0] || 'expense' in timeseries[0]) ? (
                    <>
                      {'income' in timeseries[0] && (
                        <Line type="monotone" dataKey="income" name="Income" stroke="#10B981" strokeWidth={2} dot={false} />
                      )}
                      {'expense' in timeseries[0] && (
                        <Line type="monotone" dataKey="expense" name="Expense" stroke="#EF4444" strokeWidth={2} dot={false} />
                      )}
                    </>
                  ) : (
                    <Line type="monotone" dataKey={timeseries[0].value !== undefined ? 'value' : Object.keys(timeseries[0]).find(k => k !== 'date') || 'value'} name="Value" stroke="#3B82F6" strokeWidth={2} dot={false} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>Top categories</h3>
          {summary?.topCategories?.length ? (
            <ul className={styles.list}>
              {summary.topCategories.map((c: any) => (
                <li key={c.id} className={styles.listItem}>
                  <div className={styles.listLeft}>
                    <div className={styles.avatar}>{(c.name || '').slice(0,2).toUpperCase()}</div>
                    <div>
                      <div className={styles.listName}>{c.name}</div>
                      <div className={styles.listMeta}>{c.count} transactions</div>
                    </div>
                  </div>
                  <div className={styles.listValue}>{formatCurrency(c.total, '')}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.noData}>No category data</div>
          )}
        </div>
      </div>
    </div>
  )
}
