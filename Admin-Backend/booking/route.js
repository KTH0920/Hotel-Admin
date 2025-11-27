import express from 'express';
import * as bookingController from './controller.js';
import { verifyToken as protect } from '../common/authMiddleware.js';
import { authorize } from '../common/roleMiddleware.js';

const router = express.Router();

// [중요] 모든 예약 관련 API는 로그인이 필요합니다.
router.use(protect);

// 1. (테스트용) 예약 생성 - Admin만
router.post(
    '/',
    authorize('admin'),
    bookingController.createBooking
);

// 2. 전체 예약 조회 - Staff, Admin 모두 가능
router.get(
    '/',
    authorize('staff', 'admin'),
    bookingController.getAllBookings
);

// 3. 예약 상태 변경 (취소 등) - Admin만 가능
router.patch(
    '/:id/status',
    authorize('admin'),
    bookingController.updateBookingStatus
);

export default router;