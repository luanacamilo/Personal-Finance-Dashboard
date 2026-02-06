
export interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  category_id: number;
  category_name: string;
  date: string;
  description: string | null;
  created_at: string;
}

export interface TransactionCreate {
  type: 'income' | 'expense';
  amount: number;
  category_id: number;
  date: string;
  description?: string;
}

export interface TransactionFilters {
  type?: 'income' | 'expense';
  category_id?: number;
  startDate?: string;
  endDate?: string;
}

export interface TransactionStats {
  total_income: number;
  total_expense: number;
  balance: number;
  transaction_count: number;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
}

export interface BankAccount {
  id: number;
  name: string;
  account_type: 'checking' | 'savings' | 'investment' | 'other';
  initial_balance: number;
  current_balance: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BankAccountCreate {
  name: string;
  account_type: 'checking' | 'savings' | 'investment' | 'other';
  initial_balance: number;
}

export interface RecurringTransaction {
  id: number;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category_id: number;
  category_name: string;
  bank_account_id?: number;
  bank_account_name?: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date?: string;
  day_of_month?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecurringTransactionCreate {
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category_id: number;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date?: string;
  day_of_month?: number;
  bank_account_id?: number;
}

export interface RecurringTransactionSummary {
  monthly_income: number;
  monthly_expense: number;
  monthly_balance: number;
  total_recurring: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
  message?: string;
}
