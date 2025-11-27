import express from 'express';
import * as userController from './controller.js';
import { verifyToken as protect } from '../common/authMiddleware.js'; // 별칭 사용
import { authorize } from '../common/roleMiddleware.js';

const router = express.Router();

// [중요] 이 라우터의 모든 경로는 로그인(인증)이 필요합니다.
router.use(protect);

// 1. (테스트용) 회원 생성 - Admin만
router.post(
    '/',
    authorize('admin'),
    userController.createUser
);

// 2. 전체 회원 조회 - Staff, Admin 모두 가능
router.get(
    '/',
    authorize('staff', 'admin'),
    userController.getAllUsers
);

// 3. 특정 회원 상세 조회 - Staff, Admin 모두 가능
router.get(
    '/:id',
    authorize('staff', 'admin'),
    userController.getUserById
);

// 4. 회원 상태 변경 (정지) - Admin만 가능 (중요!)
router.patch(
    '/:id/status',
    authorize('admin'),
    userController.updateStatus
);

export default router;