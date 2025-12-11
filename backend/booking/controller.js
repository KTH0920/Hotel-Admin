import * as bookingService from './service.js';
import { successResponse, errorResponse } from '../common/response.js';

// 1. 전체 예약 조회
export const getAllBookings = async (req, res) => {
    try {
        const { status, userId } = req.query;
        const bookings = await bookingService.getBookings(status, userId);
        
        res.status(200).json(successResponse(bookings, "전체 예약 목록 조회 성공"));
    } catch (error) {
        res.status(500).json(errorResponse(error.message, 500));
    }
};

// 2. 예약 상태 변경
export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await bookingService.updateBookingStatus(id, status);

        res.status(200).json(successResponse({
            status: booking.status,
            paymentStatus: booking.paymentStatus
        }, `예약 상태가 ${booking.status}로 변경되었습니다.`));
    } catch (error) {
        res.status(404).json(errorResponse(error.message, 404));
    }
};

// 3. 예약 생성 (테스트용)
export const createBooking = async (req, res) => {
    try {
        const booking = await bookingService.createBooking(req.body);
        res.status(201).json(successResponse(booking, "예약 생성 성공", 201));
    } catch (error) {
        res.status(500).json(errorResponse(error.message, 500));
    }
};