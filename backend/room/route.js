import express from 'express';
import * as roomController from './controller.js';
import { verifyToken as protect } from '../common/authMiddleware.js';
import { authorize } from '../common/roleMiddleware.js';

const router = express.Router();

// 1. 객실 생성 (사업자만)
router.post(
    '/',
    protect,
    authorize('business'),
    roomController.createRoom
);

// 2. 객실 수정 (사업자 + 관리자 가능) - 📌 요청하신 수정 반영됨
router.put(
    '/:id',
    protect,
    authorize('business', 'admin'),
    roomController.updateRoom
);

// 3. 객실 삭제 (사업자 + 관리자 가능) - 📌 요청하신 수정 반영됨
router.delete(
    '/:id',
    protect,
    authorize('business', 'admin'),
    roomController.deleteRoom
);

// (선택) 객실 상세 조회 (GET /api/rooms/:id)
// 라우트 파일에는 없었지만 컨트롤러에는 있으므로 추가해두면 좋습니다.
router.get('/:id', roomController.getRoomById);

export default router;