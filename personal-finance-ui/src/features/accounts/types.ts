export type AccountType = 
  | 'CURRENT'
  | 'SAVINGS'
  | 'CREDIT_CARD'
  | 'INVESTMENT'
  | 'CASH'
  | 'LOAN';

export interface Account {
  id?: string;
  name: string;
  type: AccountType;
  currency: string;
  balance: number;
  createdAt?: string;
}

export interface AccountFormData {
  name: string;
  type: AccountType;
  currency: string;
  balance: number;
}