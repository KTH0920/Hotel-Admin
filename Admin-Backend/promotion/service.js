import Promotion from './model.js';

// 서비스 1: 프로모션 생성
export const createPromotion = async (data) => {
    const { code } = data;

    // 코드가 있는 경우 중복 체크
    if (code) {
        const exists = await Promotion.findOne({ code });
        if (exists) {
            throw new Error('이미 존재하는 쿠폰 코드입니다.');
        }
    }

    const promotion = await Promotion.create(data);
    return promotion;
};

// 서비스 2: 목록 조회
export const getAllPromotions = async () => {
    // 최신순 정렬
    const promotions = await Promotion.find().sort({ createdAt: -1 });
    return promotions;
};

// 서비스 3: 삭제
export const deletePromotion = async (id) => {
    const promotion = await Promotion.findByIdAndDelete(id);
    if (!promotion) {
        throw new Error('프로모션을 찾을 수 없습니다.');
    }
    return promotion;
};