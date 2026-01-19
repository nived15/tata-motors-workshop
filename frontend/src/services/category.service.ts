import { apiClient } from './api'
import { Category, CreateCategoryData } from '@/types/category'

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export const categoryService = {
  // Get all categories (default + user's custom categories)
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories')
    return response.data.data
  },

  // Create a new category
  create: async (data: CreateCategoryData): Promise<Category> => {
    const response = await apiClient.post<ApiResponse<Category>>('/categories', data)
    return response.data.data
  },
}
