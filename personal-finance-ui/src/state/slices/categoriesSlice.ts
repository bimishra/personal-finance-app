// state/slices/categoriesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import { Category } from '../../types'

export const fetchCategories = createAsyncThunk('categories/fetchAll', async () => {
  const res = await api.get<Category[]>('/categories')
  return res.data
})

interface CategoriesState {
  items: Category[]
  loading: boolean
}

const initialState: CategoriesState = {
  items: [],
  loading: false
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.pending, state => {
        state.loading = true
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.items = action.payload
        state.loading = false
      })
      .addCase(fetchCategories.rejected, state => {
        state.loading = false
      })
  }
})

export default categoriesSlice.reducer
