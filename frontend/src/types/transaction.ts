export interface Transaction {
  id: string
  amount: number
  source: string
  description?: string
  categoryId: string
  category?: Category
  userId: string
  transactionDate: string
  notes?: string
  deletedAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTransactionData {
  amount: number
  source: string
  description?: string
  categoryId: string
  transactionDate: string
  notes?: string
}

export interface UpdateTransactionData extends Partial<CreateTransactionData> {
  id: string
}

export interface TransactionFilters {
  startDate?: string
  endDate?: string
  categoryId?: string
  search?: string
  page?: number
  limit?: number
}
