import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import { Account } from '../../types'

export const fetchAccounts = createAsyncThunk('accounts/fetch', async () => {
  const resp = await api.get<Account[]>('/accounts')
  return resp.data
})

export const createAccount = createAsyncThunk('accounts/create', async (payload: Partial<Account>) => {
  const resp = await api.post<Account>('/accounts', payload)
  return resp.data
})

const accountsSlice = createSlice({
  name: 'accounts',
  initialState: { items: [] as Account[], status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed' },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAccounts.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
  }
})

export default accountsSlice.reducer
