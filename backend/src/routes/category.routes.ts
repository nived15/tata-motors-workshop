import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All category routes require authentication
router.use(authenticateToken);

// Get all categories (default + user's custom categories)
router.get('/', categoryController.getCategories);

// Create a new custom category
router.post('/', categoryController.createCategory);

export default router;
