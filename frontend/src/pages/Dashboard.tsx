import { useState } from 'react'
import { Plus } from 'lucide-react'
import AddIncomeModal from '@/components/transactions/AddIncomeModal'

export default function Dashboard() {
  const [isAddIncomeModalOpen, setIsAddIncomeModalOpen] = useState(false)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your income transactions and track your finances</p>
        </div>
        <button
          onClick={() => setIsAddIncomeModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Add Income
        </button>
      </div>

      {/* Dashboard content will go here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Summary Cards */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Income (This Month)</p>
          <p className="text-2xl font-bold text-gray-900">$0.00</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Year to Date</p>
          <p className="text-2xl font-bold text-gray-900">$0.00</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Top Category</p>
          <p className="text-2xl font-bold text-gray-900">-</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500 text-center py-8">
            No transactions yet. Click "Add Income" to create your first transaction.
          </p>
        </div>
      </div>

      {/* Add Income Modal */}
      <AddIncomeModal
        isOpen={isAddIncomeModalOpen}
        onClose={() => setIsAddIncomeModalOpen(false)}
      />
    </div>
  )
}
