import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'
import { Category } from '../../types'

// Fetch all categories
export const fetchCategories = createAsyncThunk('categories/fetchAll', async () => {
  const res = await api.get<Category[]>('/categories')
  return res.data
})

// Create a new category
export const createCategory = createAsyncThunk(
  'categories/create',
  async (
    category: Omit<Category, 'id' | 'userId' | 'defaultCategory' | 'createdAt' | 'updatedAt'>,
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<Category>('/categories', category)
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message })
    }
  }
)

// Delete a category
export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/categories/${id}`)
      return id
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message })
    }
  }
)

// Update a category
export const updateCategory = createAsyncThunk(
  'categories/update',
  async (
    {
      id,
      ...category
    }: { id: string } & Omit<Category, 'id' | 'userId' | 'defaultCategory' | 'createdAt' | 'updatedAt'>,
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put<Category>(`/categories/${id}`, category)
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message })
    }
  }
)

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
      // Fetch categories
      .addCase(fetchCategories.pending, state => {
        state.loading = true
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.items = action.payload
        state.loading = false
      })
      .addCase(fetchCategories.rejected, state => {
        state.loading = false
      })

      // Create category
      .addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.items.push(action.payload)
      })

      // Delete category
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(c => c.id !== action.payload)
      })

      // Update category
      .addCase(updateCategory.pending, state => {
        state.loading = true
      })
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.items = state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
        state.loading = false
      })
      .addCase(updateCategory.rejected, state => {
        state.loading = false
      })
  }
})

export default categoriesSlice.reducer
