import * as categoryService from './service.js';
import { successResponse, errorResponse } from '../common/response.js';

// 1. 카테고리 생성
export const createCategory = async (req, res) => {
    try {
        const { type, name } = req.body;
        const category = await categoryService.createCategory(type, name);

        res.status(201).json(successResponse(category, "카테고리가 생성되었습니다.", 201));
    } catch (error) {
        // 이미 존재하는 경우 400 Bad Request
        const statusCode = error.message.includes('이미 존재') ? 400 : 500;
        res.status(statusCode).json(errorResponse(error.message, statusCode));
    }
};

// 2. 카테고리 조회
export const getCategories = async (req, res) => {
    try {
        const { type } = req.query; // ?type=amenity
        const categories = await categoryService.getCategories(type);

        res.status(200).json(successResponse(categories, "카테고리 목록 조회 성공"));
    } catch (error) {
        res.status(500).json(errorResponse(error.message, 500));
    }
};

// 3. 카테고리 삭제
export const deleteCategory = async (req, res) => {
    try {
        await categoryService.deleteCategory(req.params.id);
        res.status(200).json(successResponse(null, "카테고리가 삭제되었습니다."));
    } catch (error) {
        res.status(404).json(errorResponse(error.message, 404));
    }
};