import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import { Transaction } from '../../types'

export const fetchTransactions = createAsyncThunk(
  'transactions/fetch',
  async (params?: { from?: string; to?: string }) => {
    const resp = await api.get<Transaction[]>('/transactions', { params })
    return resp.data
  }
)

export const createTransaction = createAsyncThunk(
  'transactions/create',
  async (payload: Omit<Transaction, 'id'>) => {
    const resp = await api.post<Transaction>('/transactions', payload)
    return resp.data
  }
)

export const deleteTransaction = createAsyncThunk(
  'transactions/delete',
  async (id: string) => {
    await api.delete(`/transactions/${id}`)
    return id
  }
)

export const updateTransaction = createAsyncThunk(
  'transactions/update',
  async (txn: Transaction) => {
    const resp = await api.put<Transaction>(`/transactions/${txn.id}`, txn)
    return resp.data
  }
)

type Status = 'idle' | 'loading' | 'succeeded' | 'failed'

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: { items: [] as Transaction[], status: 'idle' as Status },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTransactions.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload)
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const idx = state.items.findIndex(t => t.id === action.payload.id)
        if (idx >= 0) {
          state.items[idx] = action.payload
        }
      })
  }
})

export default transactionsSlice.reducer
