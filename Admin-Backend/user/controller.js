import * as userService from './service.js';
import { successResponse, errorResponse } from '../common/response.js';

// 1. 전체 회원 조회 (검색)
export const getAllUsers = async (req, res) => {
    try {
        const { email, name } = req.query;
        const users = await userService.getUsers(email, name);

        res.status(200).json(successResponse(users, "회원 목록 조회 성공"));
    } catch (error) {
        res.status(500).json(errorResponse(error.message, 500));
    }
};

// 2. 특정 회원 상세 조회
export const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json(successResponse(user, "회원 상세 조회 성공"));
    } catch (error) {
        res.status(404).json(errorResponse(error.message, 404));
    }
};

// 3. 회원 상태 변경 (Ban 처리)
export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedUser = await userService.updateUserStatus(id, status);

        res.status(200).json(successResponse({
            status: updatedUser.status,
            name: updatedUser.name
        }, `회원 상태가 ${updatedUser.status}로 변경되었습니다.`));

    } catch (error) {
        const statusCode = error.message.includes('유효하지 않은') ? 400 : 404;
        res.status(statusCode).json(errorResponse(error.message, statusCode));
    }
};

// 4. (테스트용) 회원 생성
export const createUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(successResponse(user, "회원 생성 성공", 201));
    } catch (error) {
        res.status(500).json(errorResponse(error.message, 500));
    }
};