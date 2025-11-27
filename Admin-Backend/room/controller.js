import * as roomService from './service.js';
import { successResponse, errorResponse } from '../common/response.js';

// 1. 객실 생성
export const createRoom = async (req, res) => {
    try {
        const room = await roomService.createRoom(req.body);
        res.status(201).json(successResponse(room, "객실 생성 성공", 201));
    } catch (error) {
        const statusCode = error.message === '숙소를 찾을 수 없습니다.' ? 404 : 500;
        res.status(statusCode).json(errorResponse(error.message, statusCode));
    }
};

// 2. 특정 숙소의 객실 목록 조회
// (lodging 라우트에서 사용됨)
export const getRoomsByLodgingId = async (req, res) => {
    try {
        const rooms = await roomService.getRoomsByLodgingId(req.params.id);
        res.status(200).json(successResponse(rooms, "객실 목록 조회 성공"));
    } catch (error) {
        res.status(500).json(errorResponse(error.message, 500));
    }
};

// 3. 객실 수정
export const updateRoom = async (req, res) => {
    try {
        const room = await roomService.updateRoom(req.params.id, req.body);
        res.status(200).json(successResponse(room, "객실 수정 성공"));
    } catch (error) {
        res.status(404).json(errorResponse(error.message, 404));
    }
};

// 4. 객실 삭제
export const deleteRoom = async (req, res) => {
    try {
        await roomService.deleteRoom(req.params.id);
        res.status(200).json(successResponse(null, "객실 삭제 성공"));
    } catch (error) {
        res.status(404).json(errorResponse(error.message, 404));
    }
};

// 5. 객실 상세 조회
export const getRoomById = async (req, res) => {
    try {
        const room = await roomService.getRoomById(req.params.id);
        res.status(200).json(successResponse(room, "객실 상세 조회 성공"));
    } catch (error) {
        res.status(404).json(errorResponse(error.message, 404));
    }
};