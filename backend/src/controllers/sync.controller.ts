import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { syncAllTenants, syncTenant } from '../services/shopify-sync.service';

export const manualSync = async (req: AuthRequest, res: Response) => {
  try {
    const tenantId = req.user!.tenantId;

    await syncTenant(tenantId);

    res.json({ message: 'Sync completed successfully' });
  } catch (error) {
    console.error('Manual sync error:', error);
    res.status(500).json({ error: 'Sync failed' });
  }
};

export const scheduledSync = async (req: any, res: Response) => {
  try {
    const cronSecret = req.headers['x-cron-secret'];

    if (cronSecret !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await syncAllTenants();

    res.json({ message: 'Scheduled sync completed' });
  } catch (error) {
    console.error('Scheduled sync error:', error);
    res.status(500).json({ error: 'Sync failed' });
  }
};
