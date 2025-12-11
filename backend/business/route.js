import express from 'express';
import * as businessController from './controller.js';
import { verifyToken } from '../common/authMiddleware.js'; // 이름 확인 (protect -> verifyToken)
import { authorize } from '../common/roleMiddleware.js';

const router = express.Router();
const protect = verifyToken; // 별칭 사용

// 1. 모든 파트너 조회 (GET /api/businesses)
// 관리자와 Staff(CS팀) 모두 접근 가능
router.get(
    '/',
    protect,
    authorize('admin', 'staff'),
    businessController.getAllBusinesses
);

// 2. 특정 파트너 상세 조회 (GET /api/businesses/:id)
// URL 파라미터를 :businessId 대신 표준인 :id로 통일했습니다.
router.get(
    '/:id',
    protect,
    authorize('admin', 'staff'),
    businessController.getBusinessById
);

// 3. 파트너 상태 변경 (PATCH /api/businesses/:id/status)
// 오직 'admin'만 승인/거절 가능
router.patch(
    '/:id/status',
    protect,
    authorize('admin'),
    businessController.updateStatus
);

export default router;