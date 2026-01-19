import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as transactionService from '../services/transaction.service';
import logger from '../utils/logger';

export const createTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const transactionData = {
      ...req.body,
      userId,
    };

    const transaction = await transactionService.createTransaction(
      transactionData,
      {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      }
    );

    logger.info(`Transaction created: ${transaction.id} by user ${userId}`);

    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Transaction created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { startDate, endDate, categoryId, search, page = 1, limit = 10 } = req.query;

    const filters = {
      startDate: startDate as string | undefined,
      endDate: endDate as string | undefined,
      categoryId: categoryId as string | undefined,
      search: search as string | undefined,
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
    };

    const result = await transactionService.getTransactions(userId, filters);

    res.status(200).json({
      success: true,
      data: result.transactions,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactionById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const transaction = await transactionService.getTransactionById(id, userId);

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const transaction = await transactionService.updateTransaction(
      id,
      userId,
      req.body,
      {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      }
    );

    logger.info(`Transaction updated: ${id} by user ${userId}`);

    res.status(200).json({
      success: true,
      data: transaction,
      message: 'Transaction updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await transactionService.deleteTransaction(id, userId, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    logger.info(`Transaction deleted: ${id} by user ${userId}`);

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
