// 다른 도메인의 모델들을 불러옵니다. (확장자 .js 필수!)
import User from '../user/model.js';
import Business from '../business/model.js';
import Booking from '../booking/model.js';
import Review from '../review/model.js';

// 서비스: 대시보드 통계 데이터 조회
export const getStats = async () => {
    // Promise.all을 사용하여 4가지 쿼리를 병렬로 동시에 실행 (속도 최적화)
    const [userCount, pendingBusinessCount, bookingCount, reviewCount] = await Promise.all([
        User.countDocuments(),                      // 전체 유저 수
        Business.countDocuments({ status: 'pending' }), // 승인 대기중인 파트너 수
        Booking.countDocuments(),                   // 전체 예약 수
        Review.countDocuments()                     // 전체 리뷰 수
    ]);

    return {
        userCount,
        pendingBusinessCount,
        bookingCount,
        reviewCount
    };
};