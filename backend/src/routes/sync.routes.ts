import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as syncController from '../controllers/sync.controller';

const router = Router();

// Manual sync (protected route)
router.post('/manual', authenticate, syncController.manualSync);

// Scheduled sync (cron job - protected by secret)
router.post('/', syncController.scheduledSync);

export default router;
