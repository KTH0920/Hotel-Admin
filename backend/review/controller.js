import * as reviewService from './service.js';
import { successResponse, errorResponse } from '../common/response.js';

// 1. 리뷰 목록 조회
export const getAllReviews = async (req, res) => {
    try {
        const { lodgingId, isVisible, status } = req.query;
        const reviews = await reviewService.getReviews({ lodgingId, isVisible, status });

        res.status(200).json(successResponse(reviews, "리뷰 목록 조회 성공"));
    } catch (error) {
        res.status(500).json(errorResponse(error.message, 500));
    }
};

// 1-1. 리뷰 상세 조회
export const getReviewById = async (req, res) => {
    try {
        const review = await reviewService.getReviewById(req.params.id);
        res.status(200).json(successResponse(review, "리뷰 상세 조회 성공"));
    } catch (error) {
        res.status(404).json(errorResponse(error.message, 404));
    }
};

// 2. 숨김/공개 토글
export const toggleReviewVisibility = async (req, res) => {
    try {
        const { isVisible, adminComment } = req.body;
        const review = await reviewService.toggleVisibility(req.params.id, isVisible, adminComment);

        const action = review.isVisible ? '공개' : '숨김(삭제)';
        res.status(200).json(successResponse(review, `리뷰가 ${action} 처리되었습니다.`));
    } catch (error) {
        res.status(404).json(errorResponse(error.message, 404));
    }
};

// 3. 리뷰 신고
export const reportReview = async (req, res) => {
    try {
        const { reason } = req.body;
        const review = await reviewService.reportReview(req.params.id, reason);

        res.status(200).json(successResponse(review, "리뷰가 신고되었습니다."));
    } catch (error) {
        const statusCode = error.message === '이미 삭제된 리뷰입니다.' ? 400 : 404;
        res.status(statusCode).json(errorResponse(error.message, statusCode));
    }
};

// 4. 리뷰 생성
export const createReview = async (req, res) => {
    try {
        const review = await reviewService.createReview(req.body);
        res.status(201).json(successResponse(review, "리뷰 작성 성공", 201));
    } catch (error) {
        res.status(500).json(errorResponse(error.message, 500));
    }
};

// 5. 리뷰 답변 작성
export const replyToReview = async (req, res) => {
    try {
        const { reply } = req.body;
        if (!reply || reply.trim() === '') {
            return res.status(400).json(errorResponse("답변 내용을 입력해주세요.", 400));
        }
        
        const review = await reviewService.replyToReview(req.params.id, reply);
        res.status(200).json(successResponse(review, "리뷰 답변이 작성되었습니다."));
    } catch (error) {
        res.status(404).json(errorResponse(error.message, 404));
    }
};

// 6. 리뷰 완전 삭제
export const deleteReview = async (req, res) => {
    try {
        await reviewService.deleteReview(req.params.id);
        res.status(200).json(successResponse(null, "리뷰가 영구적으로 삭제되었습니다."));
    } catch (error) {
        res.status(404).json(errorResponse(error.message, 404));
    }
};