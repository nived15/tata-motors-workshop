import { apiClient } from './api'
import { Transaction, CreateTransactionData, TransactionFilters } from '@/types/transaction'

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export const transactionService = {
  // Create a new transaction
  create: async (data: CreateTransactionData): Promise<Transaction> => {
    const response = await apiClient.post<ApiResponse<Transaction>>('/transactions', data)
    return response.data.data
  },

  // Get all transactions with filters
  getAll: async (filters?: TransactionFilters): Promise<PaginatedResponse<Transaction>> => {
    const response = await apiClient.get<PaginatedResponse<Transaction>>('/transactions', {
      params: filters,
    })
    return response.data
  },

  // Get a single transaction by ID
  getById: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get<ApiResponse<Transaction>>(`/transactions/${id}`)
    return response.data.data
  },

  // Update a transaction
  update: async (id: string, data: Partial<CreateTransactionData>): Promise<Transaction> => {
    const response = await apiClient.put<ApiResponse<Transaction>>(`/transactions/${id}`, data)
    return response.data.data
  },

  // Delete a transaction
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/transactions/${id}`)
  },
}
