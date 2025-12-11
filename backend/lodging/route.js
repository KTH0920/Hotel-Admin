import express from 'express';
import * as lodgingController from './controller.js';
import * as roomController from '../room/controller.js';

import { verifyToken as protect } from '../common/authMiddleware.js';
import { authorize } from '../common/roleMiddleware.js';

const router = express.Router();

// 1. 전체 목록 조회 (관리자만)
// 순서 중요: /:id 보다 위에 있어야 함
router.get(
    '/all',
    protect,
    authorize('admin'),
    lodgingController.getAllLodgings
);

// 2. 내 숙소 목록 조회 (사업자만)
router.get(
    '/my',
    protect,
    authorize('business'),
    lodgingController.getMyLodgings
);

// 3. 숙소 등록 (사업자만)
router.post(
    '/',
    protect,
    authorize('business'),
    lodgingController.createLodging
);

// 4. 특정 숙소의 객실 목록 조회 (누구나 가능)
// lodging 라우트에서 roomController의 기능을 빌려다 씁니다.
router.get(
    '/:id/rooms',
    roomController.getRoomsByLodgingId
);

// 5. 숙소 상세 조회 (로그인한 누구나)
router.get(
    '/:id',
    protect,
    lodgingController.getLodgingById
);

// 6. 숙소 수정/삭제 (사업자, 관리자)
router.put(
    '/:id',
    protect,
    authorize('business', 'admin'),
    lodgingController.updateLodging
);

router.delete(
    '/:id',
    protect,
    authorize('business', 'admin'),
    lodgingController.deleteLodging
);

export default router;