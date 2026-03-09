import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as categoryService from '../services/category.service';
import logger from '../utils/logger';

export const getCategories = async (
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

    const categories = await categoryService.getCategories(userId);

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (
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

    const categoryData = {
      ...req.body,
      userId,
    };

    const category = await categoryService.createCategory(categoryData);

    logger.info(`Category created: ${category.id} by user ${userId}`);

    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully',
    });
  } catch (error) {
    next(error);
  }
};
