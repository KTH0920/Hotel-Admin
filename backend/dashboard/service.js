// 다른 도메인의 모델들을 불러옵니다. (확장자 .js 필수!)
import User from '../user/model.js';
import Business from '../business/model.js';
import Review from '../review/model.js';
import Promotion from '../promotion/model.js';

// 서비스: 종합 운영 통계 데이터 조회
export const getStats = async () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    // Promise.all을 사용하여 병렬로 실행
    const [
        // 회원 통계
        totalUsers,
        activeUsers,
        todayNewUsers,
        monthNewUsers,
        yearNewUsers,
        // 사업자 통계
        totalBusinesses,
        pendingBusinesses,
        approvedBusinesses,
        todayNewBusinesses,
        monthNewBusinesses,
        // 리뷰 통계
        totalReviews,
        averageRatingResult,
        reportedReviews,
        todayNewReviews,
        monthNewReviews,
        // 쿠폰 통계
        totalPromotions,
        activePromotions,
        expiredPromotions
    ] = await Promise.all([
        // 회원 통계
        User.countDocuments(),
        User.countDocuments({ status: 'active' }),
        User.countDocuments({ createdAt: { $gte: todayStart } }),
        User.countDocuments({ createdAt: { $gte: monthStart } }),
        User.countDocuments({ createdAt: { $gte: yearStart } }),
        // 사업자 통계
        Business.countDocuments(),
        Business.countDocuments({ status: 'pending' }),
        Business.countDocuments({ status: 'approved' }),
        Business.countDocuments({ createdAt: { $gte: todayStart } }),
        Business.countDocuments({ createdAt: { $gte: monthStart } }),
        // 리뷰 통계
        Review.countDocuments(),
        Review.aggregate([
            { $group: { _id: null, avg: { $avg: '$rating' } } }
        ]),
        Review.countDocuments({ status: 'reported' }),
        Review.countDocuments({ createdAt: { $gte: todayStart } }),
        Review.countDocuments({ createdAt: { $gte: monthStart } }),
        // 쿠폰 통계
        Promotion.countDocuments(),
        Promotion.countDocuments({ isActive: true, validUntil: { $gte: now } }),
        Promotion.countDocuments({ validUntil: { $lt: now } })
    ]);

    // 평균 평점 계산
    const averageRating = averageRatingResult[0]?.avg || 0;

    // 전일 신규 회원 수 계산 (변화율용)
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const yesterdayEnd = new Date(todayStart);
    
    const yesterdayNewUsers = await User.countDocuments({
        createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd }
    });

    // 전월 신규 회원 수 계산
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const lastMonthNewUsers = await User.countDocuments({
        createdAt: { $gte: lastMonthStart, $lt: lastMonthEnd }
    });

    // 전일 대비 변화율 계산
    const todayUserChange = yesterdayNewUsers > 0 
        ? (todayNewUsers - yesterdayNewUsers) / yesterdayNewUsers 
        : (todayNewUsers > 0 ? 1 : 0);

    // 전월 대비 변화율 계산
    const monthUserChange = lastMonthNewUsers > 0 
        ? (monthNewUsers - lastMonthNewUsers) / lastMonthNewUsers 
        : (monthNewUsers > 0 ? 1 : 0);

    return {
        // 회원 통계
        users: {
            total: totalUsers,
            active: activeUsers,
            today: todayNewUsers,
            thisMonth: monthNewUsers,
            thisYear: yearNewUsers,
            change: {
                today: todayUserChange,
                thisMonth: monthUserChange
            }
        },
        // 사업자 통계
        businesses: {
            total: totalBusinesses,
            pending: pendingBusinesses,
            approved: approvedBusinesses,
            today: todayNewBusinesses,
            thisMonth: monthNewBusinesses
        },
        // 리뷰 통계
        reviews: {
            total: totalReviews,
            averageRating: Math.round(averageRating * 10) / 10, // 소수점 1자리
            reported: reportedReviews,
            today: todayNewReviews,
            thisMonth: monthNewReviews
        },
        // 쿠폰 통계
        promotions: {
            total: totalPromotions,
            active: activePromotions,
            expired: expiredPromotions
        }
    };
};