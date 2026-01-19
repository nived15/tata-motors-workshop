import { Router } from 'express';
import * as transactionController from '../controllers/transaction.controller';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { createTransactionSchema } from '../validators/transaction.validator';

const router = Router();

// All transaction routes require authentication
router.use(authenticateToken);

// Create a new income transaction
router.post(
  '/',
  validateRequest(createTransactionSchema),
  transactionController.createTransaction
);

// Get all transactions for the authenticated user
router.get('/', transactionController.getTransactions);

// Get a single transaction by ID
router.get('/:id', transactionController.getTransactionById);

// Update a transaction
router.put('/:id', transactionController.updateTransaction);

// Delete a transaction (soft delete)
router.delete('/:id', transactionController.deleteTransaction);

export default router;
