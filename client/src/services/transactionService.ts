import type {
  Transaction,
  TransactionCreate,
  TransactionFilters,
  TransactionStats,
  ApiResponse
} from '../types';

const API_BASE_URL = '/api';

class TransactionService {
  
  async getAll(filters?: TransactionFilters): Promise<Transaction[]> {
    const params = new URLSearchParams();
    
    if (filters?.type) params.append('type', filters.type);
    if (filters?.category_id) params.append('category_id', filters.category_id.toString());
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/transactions${query}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }

    const data: ApiResponse<Transaction[]> = await response.json();
    return data.data || [];
  }

  async getById(id: number): Promise<Transaction> {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch transaction');
    }

    const data: ApiResponse<Transaction> = await response.json();
    
    if (!data.data) {
      throw new Error('Transaction not found');
    }

    return data.data;
  }

  async create(transaction: TransactionCreate): Promise<Transaction> {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaction)
    });

    if (!response.ok) {
      const error: ApiResponse<never> = await response.json();
      throw new Error(error.error || 'Failed to create transaction');
    }

    const data: ApiResponse<Transaction> = await response.json();
    
    if (!data.data) {
      throw new Error('Failed to create transaction');
    }

    return data.data;
  }

  async update(id: number, transaction: TransactionCreate): Promise<Transaction> {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaction)
    });

    if (!response.ok) {
      const error: ApiResponse<never> = await response.json();
      throw new Error(error.error || 'Failed to update transaction');
    }

    const data: ApiResponse<Transaction> = await response.json();
    
    if (!data.data) {
      throw new Error('Failed to update transaction');
    }

    return data.data;
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error: ApiResponse<never> = await response.json();
      throw new Error(error.error || 'Failed to delete transaction');
    }
  }

  async getStats(filters?: { startDate?: string; endDate?: string }): Promise<TransactionStats> {
    const params = new URLSearchParams();
    
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/transactions/stats${query}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    const data: ApiResponse<TransactionStats> = await response.json();
    
    if (!data.data) {
      throw new Error('Failed to fetch stats');
    }

    return data.data;
  }
}

export default new TransactionService();
