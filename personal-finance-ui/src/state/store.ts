import { configureStore } from '@reduxjs/toolkit'
import accountsReducer from './slices/countSlice'
import transactionsReducer from './slices/transactionsSlice'
import useReducer from './slices/userSlice' 
import categoriesReducer from './slices/categoriesSlice'

const store = configureStore({
  reducer: {
    accounts: accountsReducer,
    transactions: transactionsReducer,
    user: useReducer,
    categories: categoriesReducer

  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
