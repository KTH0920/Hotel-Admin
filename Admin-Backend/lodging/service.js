import Lodging from './model.js';

// 서비스 1: 숙소 생성 (사업자용)
export const createLodging = async (data, businessId) => {
    const lodging = await Lodging.create({
        ...data,
        business: businessId // 등록한 사업자 ID 기록
    });
    return lodging;
};

// 서비스 2: 전체 숙소 조회 (관리자용 - 사업자 정보 포함)
export const getAllLodgings = async () => {
    // populate를 사용해 사업자의 이메일과 이름도 같이 가져옴
    const lodgings = await Lodging.find()
        .populate('business', 'name email companyName')
        .sort({ createdAt: -1 });
    return lodgings;
};

// 서비스 3: 내 숙소 조회 (사업자용)
export const getLodgingsByBusinessId = async (businessId) => {
    const lodgings = await Lodging.find({ business: businessId })
        .sort({ createdAt: -1 });
    return lodgings;
};

// 서비스 4: 숙소 상세 조회 (공통)
export const getLodgingById = async (id) => {
    const lodging = await Lodging.findById(id).populate('business', 'name email companyName');
    if (!lodging) {
        throw new Error('숙소를 찾을 수 없습니다.');
    }
    return lodging;
};

// 서비스 5: 숙소 정보 수정
export const updateLodging = async (id, data) => {
    const lodging = await Lodging.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
    );
    if (!lodging) {
        throw new Error('숙소를 찾을 수 없습니다.');
    }
    return lodging;
};

// 서비스 6: 숙소 삭제
export const deleteLodging = async (id) => {
    const lodging = await Lodging.findByIdAndDelete(id);
    if (!lodging) {
        throw new Error('숙소를 찾을 수 없습니다.');
    }
    return lodging;
};