import Business from './model.js'; // 확장자 .js 필수

// 서비스 1: 사업자 목록 조회 (상태 필터링 및 검색)
export const getBusinesses = async (status, search) => {
    const query = {};
    
    // 상태 필터링
    if (status) {
        query.status = status;
    }
    
    // 검색 필터 (이름, 이메일, 상호명으로 검색)
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { companyName: { $regex: search, $options: 'i' } }
        ];
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

    // 업데이트할 필드 구성
    const updateData = { status };
    if (adminNotes !== undefined) {
        updateData.adminNotes = adminNotes;
    }

    // findByIdAndUpdate를 사용하여 validation을 건너뛰고 상태만 업데이트
    const business = await Business.findByIdAndUpdate(
        id,
        updateData,
        { 
            new: true, // 업데이트된 문서 반환
            runValidators: false // validation 건너뛰기 (상태만 업데이트하므로)
        }
    ).select('-password');

    if (!business) {
        throw new Error('파트너를 찾을 수 없습니다.');
    }

    return business;
};