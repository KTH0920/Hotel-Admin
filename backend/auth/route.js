import express from 'express';
import * as authController from './controller.js';
import { verifyToken } from '../common/authMiddleware.js'; // 이름 확인 (protect 대신 verifyToken 사용 중이시면 이걸로)
import { authorize } from '../common/roleMiddleware.js';

const router = express.Router();

// 미들웨어 이름 별칭 (protect로 쓰기 위해)
const protect = verifyToken;

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/register
// ⭐️ 테스트 중이라 protect 주석 처리 원하시면 아래처럼 유지하세요.
router.post(
    '/register',
    // protect, 
    // authorize('admin'), 
    authController.register
);

// GET /api/auth/me
router.get(
    '/me',
    protect,
    authorize('admin', 'staff'),
    authController.getMe
);

export default router;