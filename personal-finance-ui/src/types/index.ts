export type UUID = string



export interface User {
  id: UUID
  email: string
  displayName?: string
}

export interface Account {
  id: UUID
  userId: UUID
  name: string
  type?: string
  currency?: string
  balance: number // numeric as string from API; parse as needed
  createdAt?: string
}

export interface Category {
  id: UUID
  userId: UUID
  name: string
  type: 'INCOME' | 'EXPENSE'
  defaultCategory: boolean
  transactionCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface Transaction {
  id: UUID
  accountId: UUID
  userId: UUID
  categoryId?: UUID
  amount: string
  currency: string
  txnDate: string
  description?: string
  type: 'DEBIT' | 'CREDIT'
  createdAt?: string
}

export interface Budget {
  id: UUID
  userId: UUID
  categoryId?: UUID | null
  month: string
  limit: string
  spent: string
}
