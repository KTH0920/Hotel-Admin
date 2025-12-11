import Category from './model.js';

// 서비스 1: 카테고리 생성
export const createCategory = async (type, name) => {
    // 중복 확인
    const exists = await Category.findOne({ type, name });
    if (exists) {
        throw new Error(`이미 존재하는 ${type}입니다.`);
    }

    const category = await Category.create({ type, name });
    return category;
};

// 서비스 2: 카테고리 목록 조회
export const getCategories = async (type) => {
    const query = {};
    if (type) {
        query.type = type;
    }

    // 이름순 정렬
    const categories = await Category.find(query).sort('name');
    return categories;
};

// 서비스 3: 카테고리 삭제
export const deleteCategory = async (id) => {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
        throw new Error('카테고리를 찾을 수 없습니다.');
    }
    return category;
};