import * as lodgingService from './service.js';
import { successResponse, errorResponse } from '../common/response.js';

// 1. 숙소 생성
export const createLodging = async (req, res) => {
    try {
        // req.user는 authMiddleware에서 설정됨 (사업자 ID)
        const lodging = await lodgingService.createLodging(req.body, req.user.id);
        res.status(201).json(successResponse(lodging, "숙소가 성공적으로 등록되었습니다.", 201));
    } catch (error) {
        res.status(500).json(errorResponse(error.message, 500));
    }
};

// 2. 전체 숙소 조회 (관리자)
export const getAllLodgings = async (req, res) => {
    try {
        const lodgings = await lodgingService.getAllLodgings();
        res.status(200).json(successResponse(lodgings, "전체 숙소 목록 조회 성공"));
    } catch (error) {
        res.status(500).json(errorResponse(error.message, 500));
    }
};

// 3. 내 숙소 조회 (사업자)
export const getMyLodgings = async (req, res) => {
    try {
        const lodgings = await lodgingService.getLodgingsByBusinessId(req.user.id);
        res.status(200).json(successResponse(lodgings, "내 숙소 목록 조회 성공"));
    } catch (error) {
        res.status(500).json(errorResponse(error.message, 500));
    }
};

// 4. 상세 조회
export const getLodgingById = async (req, res) => {
    try {
        const lodging = await lodgingService.getLodgingById(req.params.id);
        res.status(200).json(successResponse(lodging, "숙소 상세 조회 성공"));
    } catch (error) {
        res.status(404).json(errorResponse(error.message, 404));
    }
};

// 5. 수정
export const updateLodging = async (req, res) => {
    try {
        const lodging = await lodgingService.updateLodging(req.params.id, req.body);
        res.status(200).json(successResponse(lodging, "숙소 정보가 수정되었습니다."));
    } catch (error) {
        res.status(500).json(errorResponse(error.message, 500));
    }
};

// 6. 삭제
export const deleteLodging = async (req, res) => {
    try {
        await lodgingService.deleteLodging(req.params.id);
        res.status(200).json(successResponse(null, "숙소가 삭제되었습니다."));
    } catch (error) {
        res.status(500).json(errorResponse(error.message, 500));
    }
};