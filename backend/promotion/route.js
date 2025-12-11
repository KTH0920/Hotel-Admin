import express from 'express';
import * as promotionController from './controller.js';
import { verifyToken as protect } from '../common/authMiddleware.js';
import { authorize } from '../common/roleMiddleware.js';

const router = express.Router();

// 1. 목록 조회 (GET /api/promotions)
// 관리자 백엔드이므로 기본적으로 protect(로그인) 필요
router.get(
    '/',
    protect,
    promotionController.getAllPromotions
);

// 2. 생성 (POST /api/promotions)
// 생성은 오직 'admin'만 가능
router.post(
    '/',
    protect,
    authorize('admin'),
    promotionController.createPromotion
);

// 3. 삭제 (DELETE /api/promotions/:id)
// 삭제도 오직 'admin'만 가능
router.delete(
    '/:id',
    protect,
    authorize('admin'),
    promotionController.deletePromotion
);

export default router;