import { RecurringTransaction, RecurringTransactionCreate, RecurringTransactionSummary, ApiResponse } from '../types/index';

const API_BASE_URL = 'http://localhost:5000/api';

export const recurringTransactionService = {
  
  async getAll(filters?: {
    is_active?: boolean;
    type?: 'income' | 'expense';
    frequency?: string;
  }): Promise<RecurringTransaction[]> {
    const params = new URLSearchParams();
    
    if (filters?.is_active !== undefined) {
      params.append('is_active', filters.is_active ? 'true' : 'false');
    }
    if (filters?.type) {
      params.append('type', filters.type);
    }
    if (filters?.frequency) {
      params.append('frequency', filters.frequency);
    }

    const url = `${API_BASE_URL}/recurring-transactions${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch recurring transactions');
    }
    const data: ApiResponse<RecurringTransaction[]> = await response.json();
    return data.data || [];
  },

  async getById(id: number): Promise<RecurringTransaction> {
    const response = await fetch(`${API_BASE_URL}/recurring-transactions/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recurring transaction');
    }
    const data: ApiResponse<RecurringTransaction> = await response.json();
    if (!data.data) {
      throw new Error('Recurring transaction not found');
    }
    return data.data;
  },

  async getSummary(): Promise<RecurringTransactionSummary> {
    const response = await fetch(`${API_BASE_URL}/recurring-transactions/summary/overview`);
    if (!response.ok) {
      throw new Error('Failed to fetch summary');
    }
    const data: ApiResponse<RecurringTransactionSummary> = await response.json();
    if (!data.data) {
      throw new Error('Failed to fetch summary');
    }
    return data.data;
  },

  async create(transaction: RecurringTransactionCreate): Promise<RecurringTransaction> {
    const response = await fetch(`${API_BASE_URL}/recurring-transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create recurring transaction');
    }

    const data: ApiResponse<RecurringTransaction> = await response.json();
    if (!data.data) {
      throw new Error('Failed to create recurring transaction');
    }
    return data.data;
  },

  async update(
    id: number,
    updates: Partial<RecurringTransactionCreate & { is_active: boolean }>
  ): Promise<RecurringTransaction> {
    const response = await fetch(`${API_BASE_URL}/recurring-transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update recurring transaction');
    }

    const data: ApiResponse<RecurringTransaction> = await response.json();
    if (!data.data) {
      throw new Error('Failed to update recurring transaction');
    }
    return data.data;
  },

  async deactivate(id: number): Promise<RecurringTransaction> {
    const response = await fetch(`${API_BASE_URL}/recurring-transactions/${id}/deactivate`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to deactivate recurring transaction');
    }

    const data: ApiResponse<RecurringTransaction> = await response.json();
    if (!data.data) {
      throw new Error('Failed to deactivate recurring transaction');
    }
    return data.data;
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/recurring-transactions/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete recurring transaction');
    }
  },
};
