import express from 'express';
import * as dashboardController from './controller.js';
import { verifyToken as protect } from '../common/authMiddleware.js';
import { authorize } from '../common/roleMiddleware.js';

const router = express.Router();

// GET /api/dashboard/stats
router.get(
    '/stats',
    protect,
    authorize('admin', 'staff'), // 관리자와 직원만 통계 확인 가능
    dashboardController.getDashboardStats
);

export default router;