import { Router } from 'express';
import * as webhookController from '../controllers/webhook.controller';

const router = Router();

// Shopify webhooks
router.post('/customers', webhookController.handleCustomerWebhook);
router.post('/orders', webhookController.handleOrderWebhook);
router.post('/products', webhookController.handleProductWebhook);
router.post('/carts/abandoned', webhookController.handleCartAbandonedWebhook);

export default router;
