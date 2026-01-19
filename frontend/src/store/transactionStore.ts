import { create } from 'zustand'
import { Transaction } from '@/types/transaction'

interface TransactionState {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
  addTransaction: (transaction: Transaction) => void
  setTransactions: (transactions: Transaction[]) => void
  updateTransaction: (id: string, transaction: Transaction) => void
  removeTransaction: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  isLoading: false,
  error: null,
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),
  setTransactions: (transactions) => set({ transactions }),
  updateTransaction: (id, transaction) =>
    set((state) => ({
      transactions: state.transactions.map((t) => (t.id === id ? transaction : t)),
    })),
  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))
