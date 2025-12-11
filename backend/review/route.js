import express from 'express';
import * as reviewController from './controller.js';
import { verifyToken as protect } from '../common/authMiddleware.js';
import { authorize } from '../common/roleMiddleware.js';

const router = express.Router();

// 모든 라우트에 로그인 필수 적용
router.use(protect);

// 1. 전체 리뷰 조회 (관리자, Staff)
// 💡 활용: /api/reviews?status=reported (신고된 리뷰 탭)
router.get(
    '/',
    authorize('admin', 'staff'),
    reviewController.getAllReviews
);

// 2. 리뷰 숨김/공개 처리 (관리자, Staff)
router.patch(
    '/:id/visibility',
    authorize('admin', 'staff'),
    reviewController.toggleReviewVisibility
);

// 3. 리뷰 신고 접수 (사업자 전용)
router.post(
    '/:id/report',
    authorize('business'),
    reviewController.reportReview
);

// 4. (테스트용) 리뷰 강제 생성 (관리자만)
router.post(
    '/',
    authorize('admin'),
    reviewController.createReview
);

// 5. 리뷰 완전 삭제 (Hard Delete) - 오직 Admin만 가능
router.delete(
    '/:id',
    authorize('admin'),
    reviewController.deleteReview
);

export default router;