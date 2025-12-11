import Review from './model.js';

// 서비스 1: 전체 리뷰 조회 (필터링 + 상세 정보)
// 💡 사용법: getReviews({ status: 'reported' }) -> 신고된 것만 조회
export const getReviews = async ({ lodgingId, isVisible, status }) => {
    const filter = {};

    if (lodgingId) filter.lodging = lodgingId;

    // isVisible 필터 (문자열 'true'/'false' 처리)
    if (isVisible !== undefined) {
        filter.isVisible = isVisible === 'true';
    }

    // 상태 필터 (active, reported, hidden)
    if (status) filter.status = status;

    const reviews = await Review.find(filter)
        .populate('user', 'name email status') // 작성자 정보 (악성 유저 확인용)
        .populate('lodging', 'name')           // 숙소 이름
        .sort({ createdAt: -1 });

    return reviews;
};

// 서비스 1-1: 특정 리뷰 상세 조회
export const getReviewById = async (id) => {
    const review = await Review.findById(id)
        .populate('user', 'name email status')
        .populate('lodging', 'name')
        .populate('booking', 'checkIn checkOut');
    
    if (!review) {
        throw new Error('리뷰를 찾을 수 없습니다.');
    }
    
    return review;
};

// 서비스 2: 리뷰 숨김/공개 처리 (관리자)
export const toggleVisibility = async (id, isVisible, adminComment) => {
    const updateData = {
        isVisible,
        adminComment
    };

    // 로직: 숨기면 status도 'hidden', 공개하면 'active'로 복구
    if (isVisible === false) {
        updateData.status = 'hidden';
    } else {
        updateData.status = 'active'; // 복구 시 active로
    }

    const review = await Review.findByIdAndUpdate(id, updateData, { new: true });

    if (!review) {
        throw new Error('리뷰를 찾을 수 없습니다.');
    }
    return review;
};

// 서비스 3: 리뷰 신고 접수 (사업자)
export const reportReview = async (id, reason) => {
    const review = await Review.findById(id);
    if (!review) {
        throw new Error('리뷰를 찾을 수 없습니다.');
    }

    // 이미 삭제된 리뷰는 신고 불가
    if (review.status === 'hidden') {
        throw new Error('이미 삭제된 리뷰입니다.');
    }

    // 상태 업데이트
    review.status = 'reported';
    review.reportReason = reason;
    await review.save();

    return review;
};

// 서비스 4: 리뷰 생성 (테스트용)
export const createReview = async (data) => {
    const review = await Review.create(data);
    return review;
};

// 서비스 5: 리뷰 답변 작성 (관리자)
export const replyToReview = async (id, reply) => {
    const review = await Review.findByIdAndUpdate(
        id,
        { reply, replyAt: new Date() },
        { new: true }
    )
    .populate('user', 'name email status')
    .populate('lodging', 'name');
    
    if (!review) {
        throw new Error('리뷰를 찾을 수 없습니다.');
    }
    
    return review;
};

// 서비스 6: 리뷰 완전 삭제 (Hard Delete) - 관리자 전용
export const deleteReview = async (id) => {
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
        throw new Error('리뷰를 찾을 수 없습니다.');
    }
    return review;
};