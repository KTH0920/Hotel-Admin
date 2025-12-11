import Business from './model.js'; // 확장자 .js 필수

// 서비스 1: 사업자 목록 조회 (상태 필터링)
export const getBusinesses = async (status) => {
    const query = {};
    if (status) {
        query.status = status;
    }
    // 비밀번호 제외하고 조회, 최신 가입순 정렬
    const businesses = await Business.find(query)
        .select('-password')
        .sort({ createdAt: -1 });

    return businesses;
};

// 서비스 2: 특정 사업자 상세 조회
export const getBusinessById = async (id) => {
    const business = await Business.findById(id).select('-password');
    if (!business) {
        throw new Error('파트너를 찾을 수 없습니다.');
    }
    return business;
};

// 서비스 3: 상태 업데이트 (승인/거절)
export const updateBusinessStatus = async (id, status, adminNotes) => {
    // 유효한 상태 값인지 확인
    const allowedStatus = ['pending', 'approved', 'rejected', 'suspended'];
    if (!allowedStatus.includes(status)) {
        throw new Error('유효하지 않은 상태 값입니다.');
    }

    const business = await Business.findById(id);
    if (!business) {
        throw new Error('파트너를 찾을 수 없습니다.');
    }

    // 상태 업데이트
    business.status = status;

    // 관리자 메모 업데이트
    if (adminNotes) {
        business.adminNotes = adminNotes;
    }

    await business.save();
    return business;
};