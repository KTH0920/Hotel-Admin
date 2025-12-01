import User from './model.js';

// 서비스 1: 회원 목록 조회 (이메일/이름 검색 포함, role 필터링)
export const getUsers = async (email, name, role) => {
    let filter = {};

    if (email) {
        filter.email = email;
    }

    if (name) {
        // 이름 검색: 부분 일치 (regex)
        filter.name = { $regex: name, $options: 'i' };
    }

    // role 필터링: role이 지정되지 않았거나 'user'인 경우만 조회 (일반 유저만)
    if (role !== undefined) {
        filter.role = role;
    } else {
        // 기본적으로 business가 아닌 유저만 조회 (일반 유저)
        filter.role = { $ne: 'business' };
    }

    // 비밀번호 제외하고 조회, 최신 가입순
    const users = await User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 });

    return users;
};

// 서비스 2: 특정 회원 상세 조회
export const getUserById = async (id) => {
    const user = await User.findById(id).select('-password');
    if (!user) {
        throw new Error('회원을 찾을 수 없습니다.');
    }
    return user;
};

// 서비스 3: 회원 상태 변경 (정지/해제)
export const updateUserStatus = async (id, status) => {
    // 유효한 상태 값인지 확인
    const allowedStatus = ['active', 'banned', 'withdrawn'];
    if (!allowedStatus.includes(status)) {
        throw new Error('유효하지 않은 상태 값입니다.');
    }

    const user = await User.findByIdAndUpdate(
        id,
        { status },
        { new: true } // 업데이트된 정보 반환
    ).select('-password');

    if (!user) {
        throw new Error('회원을 찾을 수 없습니다.');
    }

    return user;
};

// 서비스 4: 회원 생성 (테스트용)
export const createUser = async (userData) => {
    // 테스트용이므로 비밀번호 암호화 로직 등은 생략하거나 필요시 추가
    const user = await User.create(userData);
    return user;
};