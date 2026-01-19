export interface DashboardStats {
  totalIncomeCurrentMonth: number
  totalIncomeYearToDate: number
  topCategory: {
    name: string
    percentage: number
    amount: number
  }
  transactionCount: number
  monthlyTrend: MonthlyTrendData[]
  categoryDistribution: CategoryDistributionData[]
  recentTransactions: Transaction[]
}

export interface MonthlyTrendData {
  month: string
  amount: number
  year: number
}

export interface CategoryDistributionData {
  categoryId: string
  categoryName: string
  categoryColor: string
  amount: number
  percentage: number
  count: number
}

import { Transaction } from './transaction'
