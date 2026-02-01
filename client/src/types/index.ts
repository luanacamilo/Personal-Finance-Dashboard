
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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
  message?: string;
}
