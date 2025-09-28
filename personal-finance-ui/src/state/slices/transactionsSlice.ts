import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import { Transaction } from '../../types'

// Normalized shape we keep in the Redux store
interface TransactionPage {
  content: Transaction[];
  page: number;            // zero-based page index
  size: number;            // requested page size (may differ from content length on last page)
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export const fetchTransactions = createAsyncThunk(
  'transactions/fetch',
  async (
    params: { page?: number; size?: number; from?: string; to?: string; accountId?: string } | undefined,
    thunkApi
  ) => {
    const state = thunkApi.getState() as { transactions: TransactionsState };
    const page = params?.page ?? state.transactions.page ?? 0;
    const size = params?.size ?? state.transactions.size ?? 10;
    const accountId = params?.accountId ?? state.transactions.accountId;
    const query = { ...params, page, size };
    let url = '/transactions';
    if (accountId && accountId !== 'ALL') {
      url = `/transactions/account/${accountId}`; // account-specific endpoint per requirement
    }
    const resp = await api.get<any>(url, { params: query });
    const data = resp.data;
    const normalized: TransactionPage = {
      content: data.content ?? [],
      page: (data.page ?? data.number) ?? 0,
      size: data.size ?? query.size ?? 10,
      totalElements: data.totalElements ?? data.total ?? 0,
      totalPages: data.totalPages ?? data.totalPage ?? 0,
      last: data.last ?? false
    };
    return { ...normalized, accountId: accountId ?? null } as TransactionPage & { accountId: string | null };
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

interface TransactionsState {
  items: Transaction[];
  status: Status;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  accountId: string | null; // currently applied account filter
}

const initialState: TransactionsState = {
  items: [],
  status: 'idle',
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
  last: true,
  accountId: null
}

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearAccountFilter: (state) => {
      state.accountId = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTransactions.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.content
        state.page = action.payload.page
        state.size = action.payload.size
        state.totalElements = action.payload.totalElements
        // Fallback: if API sends 0 totalPages but elements exceed a single page, compute.
        const computedTotalPages = state.size > 0 ? Math.max(1, Math.ceil(state.totalElements / state.size)) : 1
        state.totalPages = action.payload.totalPages && action.payload.totalPages > 0
          ? action.payload.totalPages
          : computedTotalPages
        state.last = action.payload.last ?? (state.page >= state.totalPages - 1)
        // Track current account filter
        // @ts-ignore
        state.accountId = action.payload.accountId ?? state.accountId ?? null
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
        state.totalElements += 1
        // Recompute pagination metadata (optimistic) so navigation stays accurate
        state.totalPages = Math.max(1, Math.ceil(state.totalElements / state.size))
        state.last = state.page >= state.totalPages - 1
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload)
        state.totalElements = Math.max(0, state.totalElements - 1)
        state.totalPages = state.totalElements === 0 ? 0 : Math.max(1, Math.ceil(state.totalElements / state.size))
        if (state.page >= state.totalPages) {
          state.page = Math.max(0, state.totalPages - 1)
        }
        state.last = state.page >= (state.totalPages === 0 ? 0 : state.totalPages - 1)
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const idx = state.items.findIndex(t => t.id === action.payload.id)
        if (idx >= 0) {
          state.items[idx] = action.payload
        }
      })
  }
})

export const { clearAccountFilter } = transactionsSlice.actions;
export default transactionsSlice.reducer
