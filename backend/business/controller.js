import * as businessService from './service.js';
import { successResponse, errorResponse } from '../common/response.js';

// 1. 목록 조회
export const getAllBusinesses = async (req, res) => {
    try {
        const { status } = req.query; // ?status=pending
        const businesses = await businessService.getBusinesses(status);

        res.status(200).json(successResponse(businesses, "사업자 목록 조회 성공"));
    } catch (error) {
        res.status(500).json(errorResponse(error.message, 500));
    }
};

// 2. 상세 조회
export const getBusinessById = async (req, res) => {
    try {
        const { id } = req.params;
        const business = await businessService.getBusinessById(id);

        res.status(200).json(successResponse(business, "사업자 상세 조회 성공"));
    } catch (error) {
        res.status(404).json(errorResponse(error.message, 404));
    }
};

// 3. 상태 변경 (승인 등)
export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;

        const updatedBusiness = await businessService.updateBusinessStatus(id, status, adminNotes);

        res.status(200).json(successResponse({
            status: updatedBusiness.status,
            adminNotes: updatedBusiness.adminNotes
        }, "파트너 상태가 성공적으로 업데이트되었습니다."));

    } catch (error) {
        const statusCode = error.message === '유효하지 않은 상태 값입니다.' ? 400 : 500;
        res.status(statusCode).json(errorResponse(error.message, statusCode));
    }
};