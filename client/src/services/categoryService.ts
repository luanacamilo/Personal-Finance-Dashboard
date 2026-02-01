import type { Category, ApiResponse } from '../types';

const API_BASE_URL = '/api';

class CategoryService {
  async getAll(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data: ApiResponse<Category[]> = await response.json();
    return data.data || [];
  }
}

export default new CategoryService();
