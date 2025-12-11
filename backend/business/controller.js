import * as businessService from './service.js';
import { successResponse, errorResponse } from '../common/response.js';

// 1. 목록 조회
export const getAllBusinesses = async (req, res) => {
    try {
        const { status, search } = req.query;
        
        // status 필터링 (all인 경우 필터링하지 않음)
        const statusFilter = status && status !== 'all' ? status : undefined;
        const businesses = await businessService.getBusinesses(statusFilter, search);

        // 통계 계산
        const totalOwners = businesses.length;
        const activeOwners = businesses.filter(b => b.status === 'approved').length;
        const pendingOwners = businesses.filter(b => b.status === 'pending').length;
        const suspendedOwners = businesses.filter(b => b.status === 'suspended').length;
        
        // 프론트엔드가 기대하는 형식으로 변환
        const owners = businesses.map(business => ({
            id: business._id || business.id,
            name: business.name,
            email: business.email,
            phone: business.phoneNumber || business.phone,
            companyName: business.companyName,
            businessNumber: business.businessNumber,
            status: business.status,
            joinedAt: business.createdAt ? new Date(business.createdAt).toLocaleDateString() : '-',
            totalHotels: 0, // 호텔 정보는 별도로 조회 필요
            hotels: [], // 호텔 정보는 별도로 조회 필요
        }));

        const summary = {
            totalOwners,
            activeOwners,
            pendingOwners,
            suspendedOwners,
            totalHotels: 0, // 호텔 정보는 별도로 조회 필요
            riskHotels: 0, // 호텔 정보는 별도로 조회 필요
        };

        res.status(200).json(successResponse({
            owners,
            summary
        }, "사업자 목록 조회 성공"));
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