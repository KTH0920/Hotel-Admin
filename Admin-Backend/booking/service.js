import Booking from './model.js';

// 서비스 1: 전체 예약 조회 (필터링 + 상세 정보 포함)
export const getBookings = async (status, userId) => {
    const filter = {};

    if (status) filter.status = status;
    if (userId) filter.user = userId;

    // populate: 연관된 테이블의 정보를 같이 가져옴
    const bookings = await Booking.find(filter)
        .populate('user', 'name email')        // 예약자 이름/이메일
        .populate('lodging', 'name category')  // 숙소 이름/카테고리
        .populate('room', 'name')              // 객실 이름
        .sort({ createdAt: -1 });              // 최신순 정렬

    return bookings;
};

// 서비스 2: 예약 상태 변경 (취소/확정 등)
export const updateBookingStatus = async (id, status) => {
    // 유효한 상태 값인지 확인
    const allowedStatus = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!allowedStatus.includes(status)) {
        throw new Error('유효하지 않은 예약 상태입니다.');
    }

    const booking = await Booking.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );

    if (!booking) {
        throw new Error('예약을 찾을 수 없습니다.');
    }
    return booking;
};

// 서비스 3: 예약 생성 (테스트용)
export const createBooking = async (data) => {
    // data 안에 user, lodging, room ID가 다 들어있어야 함
    const booking = await Booking.create(data);
    return booking;
};