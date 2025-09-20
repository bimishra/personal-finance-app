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

export const createTransaction = createAsyncThunk('transactions/create', async (payload: Partial<Transaction>) => {
  const resp = await api.post<Transaction>('/transactions', payload)
  return resp.data
})

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

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
  }
})

export default transactionsSlice.reducer
