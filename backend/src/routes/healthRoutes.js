import { Router } from 'express';
import { sendSuccess } from '../utils/response.js';

const router = Router();

router.get('/health', (req, res) => {
  return sendSuccess(res, {
    status: 'ok',
    service: 'clothing-store-backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
