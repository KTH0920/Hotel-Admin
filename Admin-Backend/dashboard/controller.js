import * as dashboardService from './service.js';
import { successResponse, errorResponse } from '../common/response.js';

// 대시보드 통계 조회
export const getDashboardStats = async (req, res) => {
    try {
        const stats = await dashboardService.getStats();

        res.status(200).json(successResponse(stats, "대시보드 데이터 조회 성공"));
    } catch (error) {
        res.status(500).json(errorResponse(error.message, 500));
    }
};