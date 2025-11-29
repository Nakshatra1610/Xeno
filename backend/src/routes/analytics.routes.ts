import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as analyticsController from '../controllers/analytics.controller';

const router = Router();

// Get analytics data (protected route)
router.get('/', authenticate, analyticsController.getAnalytics);

export default router;
