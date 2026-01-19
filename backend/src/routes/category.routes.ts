import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { authenticateToken } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimit';

const router = Router();

// Apply rate limiting to all routes
router.use(apiLimiter);

// All category routes require authentication
router.use(authenticateToken);

// Get all categories (default + user's custom categories)
router.get('/', categoryController.getCategories);

// Create a new custom category
router.post('/', categoryController.createCategory);

export default router;
