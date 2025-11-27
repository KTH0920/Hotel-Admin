// 다른 도메인의 모델들을 불러옵니다. (확장자 .js 필수!)
import User from '../user/model.js';
import Business from '../business/model.js';
import Booking from '../booking/model.js';
import Review from '../review/model.js';

// 서비스: 대시보드 통계 데이터 조회
export const getStats = async () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    // 완료된 예약만 매출에 포함 (status: 'completed', paymentStatus: 'paid')
    const completedBookingsFilter = {
        status: 'completed',
        paymentStatus: 'paid'
    };

    // Promise.all을 사용하여 병렬로 실행
    const [
        userCount,
        pendingBusinessCount,
        bookingCount,
        reviewCount,
        totalRevenueResult,
        todayRevenueResult,
        monthRevenueResult,
        yearRevenueResult,
        todayBookings,
        monthBookings,
        yearBookings
    ] = await Promise.all([
        User.countDocuments(),
        Business.countDocuments({ status: 'pending' }),
        Booking.countDocuments(),
        Review.countDocuments(),
        // 총 매출 (전체 완료된 예약)
        Booking.aggregate([
            { $match: completedBookingsFilter },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]),
        // 오늘 매출
        Booking.aggregate([
            {
                $match: {
                    ...completedBookingsFilter,
                    createdAt: { $gte: todayStart }
                }
            },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]),
        // 이번 달 매출
        Booking.aggregate([
            {
                $match: {
                    ...completedBookingsFilter,
                    createdAt: { $gte: monthStart }
                }
            },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]),
        // 올해 매출
        Booking.aggregate([
            {
                $match: {
                    ...completedBookingsFilter,
                    createdAt: { $gte: yearStart }
                }
            },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]),
        // 오늘 예약 수
        Booking.countDocuments({
            status: 'completed',
            createdAt: { $gte: todayStart }
        }),
        // 이번 달 예약 수
        Booking.countDocuments({
            status: 'completed',
            createdAt: { $gte: monthStart }
        }),
        // 올해 예약 수
        Booking.countDocuments({
            status: 'completed',
            createdAt: { $gte: yearStart }
        })
    ]);

    // 전일 매출 계산 (어제)
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const yesterdayEnd = new Date(todayStart);
    
    const yesterdayRevenueResult = await Booking.aggregate([
        {
            $match: {
                ...completedBookingsFilter,
                createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd }
            }
        },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    // 전월 매출 계산
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const lastMonthRevenueResult = await Booking.aggregate([
        {
            $match: {
                ...completedBookingsFilter,
                createdAt: { $gte: lastMonthStart, $lt: lastMonthEnd }
            }
        },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    // 전년 매출 계산
    const lastYearStart = new Date(now.getFullYear() - 1, 0, 1);
    const lastYearEnd = new Date(now.getFullYear(), 0, 1);
    
    const lastYearRevenueResult = await Booking.aggregate([
        {
            $match: {
                ...completedBookingsFilter,
                createdAt: { $gte: lastYearStart, $lt: lastYearEnd }
            }
        },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const totalRevenue = totalRevenueResult[0]?.total || 0;
    const todayRevenue = todayRevenueResult[0]?.total || 0;
    const monthRevenue = monthRevenueResult[0]?.total || 0;
    const yearRevenue = yearRevenueResult[0]?.total || 0;
    const yesterdayRevenue = yesterdayRevenueResult[0]?.total || 0;
    const lastMonthRevenue = lastMonthRevenueResult[0]?.total || 0;
    const lastYearRevenue = lastYearRevenueResult[0]?.total || 0;

    // 전일 대비 변화율 계산
    const todayChange = yesterdayRevenue > 0 
        ? (todayRevenue - yesterdayRevenue) / yesterdayRevenue 
        : (todayRevenue > 0 ? 1 : 0);

    // 전월 대비 변화율 계산
    const monthChange = lastMonthRevenue > 0 
        ? (monthRevenue - lastMonthRevenue) / lastMonthRevenue 
        : (monthRevenue > 0 ? 1 : 0);

    // 전년 대비 변화율 계산
    const yearChange = lastYearRevenue > 0 
        ? (yearRevenue - lastYearRevenue) / lastYearRevenue 
        : (yearRevenue > 0 ? 1 : 0);

    return {
        totalRevenue,
        today: {
            revenue: todayRevenue,
            bookings: todayBookings,
            change: {
                revenue: todayChange,
                bookings: 0
            }
        },
        thisMonth: {
            revenue: monthRevenue,
            bookings: monthBookings,
            change: {
                revenue: monthChange,
                bookings: 0
            }
        },
        thisYear: {
            revenue: yearRevenue,
            bookings: yearBookings,
            change: {
                revenue: yearChange,
                bookings: 0
            }
        },
        // 기존 카운트 데이터도 포함 (필요시 사용)
        userCount,
        pendingBusinessCount,
        bookingCount,
        reviewCount
    };
};