import express from 'express';
import * as categoryController from './controller.js';
import { verifyToken as protect } from '../common/authMiddleware.js';
import { authorize } from '../common/roleMiddleware.js';

const router = express.Router();

// 1. 조회 (GET /api/categories?type=amenity)
// 관리자 백엔드이므로 기본적으로 로그인 필요 (protect)
router.get(
    '/',
    protect,
    categoryController.getCategories
);

// 2. 생성 (POST /api/categories)
// Admin만 가능
router.post(
    '/',
    protect,
    authorize('admin'),
    categoryController.createCategory
);

// 3. 삭제 (DELETE /api/categories/:id)
// Admin만 가능
router.delete(
    '/:id',
    protect,
    authorize('admin'),
    categoryController.deleteCategory
);

export default router;