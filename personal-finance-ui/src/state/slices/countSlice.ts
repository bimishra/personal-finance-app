import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import { Account } from '@/features/accounts/types'

export const fetchAccounts = createAsyncThunk('accounts/fetch', async () => {
  const resp = await api.get<Account[]>('/accounts')
  return resp.data
})

export const createAccount = createAsyncThunk('accounts/create', async (payload: Partial<Account>) => {
  const resp = await api.post<Account>('/accounts', payload)
  return resp.data
})

export const updateAccount = createAsyncThunk(
  'accounts/update',
  async (account: Account) => {
    const resp = await api.put<Account>(`/accounts/${account.id}`, account)
    return resp.data
  }
)

export const deleteAccount = createAsyncThunk(
  'accounts/delete',
  async (accountId: string) => {
    await api.delete(`/accounts/${accountId}`)
    return accountId
  }
)

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
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.items = state.items.map(account =>
          account.id === action.payload.id ? action.payload : account
        )
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.items = state.items.filter(account => account.id !== action.payload)
      })
  }
})

export default accountsSlice.reducer
