import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { toast } from 'react-toastify'
import { transactionService } from '@/services/transaction.service'
import { categoryService } from '@/services/category.service'
import { useTransactionStore } from '@/store/transactionStore'
import { Category } from '@/types/category'
import { format } from 'date-fns'

const transactionSchema = z.object({
  amount: z
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .positive('Amount must be a positive number')
    .max(999999999.99, 'Amount cannot exceed 999,999,999.99')
    .refine((val) => {
      // Check if it has at most 2 decimal places
      const decimalStr = val.toString().split('.')[1]
      return !decimalStr || decimalStr.length <= 2
    }, 'Amount can have at most 2 decimal places'),
  source: z
    .string()
    .trim()
    .min(1, 'Source is required')
    .max(255, 'Source cannot exceed 255 characters'),
  categoryId: z.string().uuid('Please select a category'),
  transactionDate: z
    .string()
    .refine((date) => {
      const selectedDate = new Date(date)
      const today = new Date()
      today.setHours(23, 59, 59, 999)
      return selectedDate <= today
    }, 'Date cannot be in the future'),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
})

type TransactionFormData = z.infer<typeof transactionSchema>

interface AddIncomeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddIncomeModal({ isOpen, onClose }: AddIncomeModalProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const addTransaction = useTransactionStore((state) => state.addTransaction)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    mode: 'onChange',
    defaultValues: {
      transactionDate: format(new Date(), 'yyyy-MM-dd'),
    },
  })

  const notes = watch('notes') || ''
  const notesLength = notes.length

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll()
        setCategories(data)
      } catch (error) {
        toast.error('Failed to load categories')
        console.error('Error fetching categories:', error)
      }
    }

    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

  const onSubmit = async (data: TransactionFormData) => {
    setIsSubmitting(true)
    try {
      const transaction = await transactionService.create({
        ...data,
        amount: Number(data.amount),
      })
      
      addTransaction(transaction)
      toast.success('Income transaction added successfully!')
      reset({
        transactionDate: format(new Date(), 'yyyy-MM-dd'),
      })
      onClose()
    } catch (error: unknown) {
      let errorMessage = 'Failed to add transaction. Please try again.'
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { errors?: Array<{ message?: string }>, message?: string } } }
        errorMessage = axiosError.response?.data?.errors?.[0]?.message || 
                      axiosError.response?.data?.message || 
                      errorMessage
      }
      
      toast.error(errorMessage)
      console.error('Error creating transaction:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset({
      transactionDate: format(new Date(), 'yyyy-MM-dd'),
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Income Transaction</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Amount Field */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                {...register('amount', { valueAsNumber: true })}
                type="number"
                id="amount"
                step="0.01"
                placeholder="0.00"
                className={`w-full pl-8 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          {/* Source Field */}
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
              Source <span className="text-red-500">*</span>
            </label>
            <input
              {...register('source')}
              type="text"
              id="source"
              placeholder="e.g., Salary, Freelance Project"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.source ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={255}
            />
            {errors.source && (
              <p className="mt-1 text-sm text-red-600">{errors.source.message}</p>
            )}
          </div>

          {/* Category Field */}
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              {...register('categoryId')}
              id="categoryId"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.categoryId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Date Field */}
          <div>
            <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              {...register('transactionDate')}
              type="date"
              id="transactionDate"
              max={format(new Date(), 'yyyy-MM-dd')}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.transactionDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.transactionDate && (
              <p className="mt-1 text-sm text-red-600">{errors.transactionDate.message}</p>
            )}
          </div>

          {/* Notes Field */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              {...register('notes')}
              id="notes"
              rows={3}
              placeholder="Add any additional notes..."
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                errors.notes ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.notes ? (
                <p className="text-sm text-red-600">{errors.notes.message}</p>
              ) : (
                <span className="text-sm text-gray-500">
                  {notesLength}/1000 characters
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
