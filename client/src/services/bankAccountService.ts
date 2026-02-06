import { BankAccount, BankAccountCreate, ApiResponse } from '../types/index';

const API_BASE_URL = 'http://localhost:5000/api';

export const bankAccountService = {
 
  async getAll(): Promise<BankAccount[]> {
    const response = await fetch(`${API_BASE_URL}/bank-accounts`);
    if (!response.ok) {
      throw new Error('Failed to fetch bank accounts');
    }
    const data: ApiResponse<BankAccount[]> = await response.json();
    return data.data || [];
  },

  async getById(id: number): Promise<BankAccount> {
    const response = await fetch(`${API_BASE_URL}/bank-accounts/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch bank account');
    }
    const data: ApiResponse<BankAccount> = await response.json();
    if (!data.data) {
      throw new Error('Bank account not found');
    }
    return data.data;
  },

  
  async getTotalBalance(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/bank-accounts/summary/balance`);
    if (!response.ok) {
      throw new Error('Failed to fetch total balance');
    }
    const data: ApiResponse<{ total_balance: number }> = await response.json();
    return data.data?.total_balance || 0;
  },

  
  async create(account: BankAccountCreate): Promise<BankAccount> {
    const response = await fetch(`${API_BASE_URL}/bank-accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(account),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create bank account');
    }

    const data: ApiResponse<BankAccount> = await response.json();
    if (!data.data) {
      throw new Error('Failed to create bank account');
    }
    return data.data;
  },

  
  async update(
    id: number,
    updates: Partial<BankAccountCreate>
  ): Promise<BankAccount> {
    const response = await fetch(`${API_BASE_URL}/bank-accounts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update bank account');
    }

    const data: ApiResponse<BankAccount> = await response.json();
    if (!data.data) {
      throw new Error('Failed to update bank account');
    }
    return data.data;
  },

  async updateBalance(id: number, amount: number): Promise<BankAccount> {
    const response = await fetch(`${API_BASE_URL}/bank-accounts/${id}/balance`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update balance');
    }

    const data: ApiResponse<BankAccount> = await response.json();
    if (!data.data) {
      throw new Error('Failed to update balance');
    }
    return data.data;
  },

  
  async deactivate(id: number): Promise<BankAccount> {
    const response = await fetch(`${API_BASE_URL}/bank-accounts/${id}/deactivate`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to deactivate bank account');
    }

    const data: ApiResponse<BankAccount> = await response.json();
    if (!data.data) {
      throw new Error('Failed to deactivate bank account');
    }
    return data.data;
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/bank-accounts/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete bank account');
    }
  },
};
