import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminAuthContext } from "../../context/AdminAuthContext";
import { adminStatsApi } from "../../api/adminStatsApi";
import { adminCouponApi } from "../../api/adminCouponApi";
import { adminReviewApi } from "../../api/adminReviewApi";
import { adminBusinessApi } from "../../api/adminBusinessApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

// 아이콘 컴포넌트들
const DashboardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"></rect>
    <rect x="14" y="3" width="7" height="7" rx="1"></rect>
    <rect x="14" y="14" width="7" height="7" rx="1"></rect>
    <rect x="3" y="14" width="7" height="7" rx="1"></rect>
  </svg>
);

const BusinessIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const CouponIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="4" rx="1"></rect>
    <path d="M12 8v13"></path>
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path>
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"></path>
  </svg>
);

const StatisticsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const ReviewIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const SettingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
  </svg>
);

const ProfileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { adminInfo } = useContext(AdminAuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboardData, setDashboardData] = useState({
    statistics: null,
    business: null,
    coupons: null,
    reviews: null,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [stats, businessData, couponsData, reviewsData] = await Promise.all([
        adminStatsApi.getStatistics(),
        adminBusinessApi.getOwners(),
        adminCouponApi.getCoupons(),
        adminReviewApi.getReviews(),
      ]);

      setDashboardData({
        statistics: stats,
        business: businessData,
        coupons: couponsData,
        reviews: reviewsData,
      });
    } catch (err) {
      setError(err.message || "데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ko-KR").format(amount || 0);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat("ko-KR").format(value || 0);
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchDashboardData} />;

  const { statistics, business, coupons, reviews } = dashboardData;

  // 데이터가 없으면 빈 화면 방지
  if (!statistics && !business && !coupons && !reviews) {
    return (
      <div className="business-dashboard-page">
        <div className="page-header">
          <div>
            <h1 className="page-title">대시보드</h1>
            <p className="page-subtitle">데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 통계 데이터 계산
  const totalRevenue = statistics?.totalRevenue || statistics?.thisYear?.revenue || 0;
  const todayRevenue = statistics?.today?.revenue || 0;
  const thisMonthRevenue = statistics?.thisMonth?.revenue || 0;

  // 사업자 데이터
  const totalOwners = business?.summary?.totalOwners || 0;
  const activeOwners = business?.summary?.activeOwners || 0;
  const pendingOwners = business?.summary?.pendingOwners || 0;
  const riskHotels = business?.summary?.riskHotels || 0;

  // 쿠폰 데이터
  const allCoupons = coupons?.coupons || coupons || [];
  const totalCoupons = allCoupons.length;
  const activeCoupons = allCoupons.filter((c) => c.status === "active").length;
  const usedCoupons = allCoupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);

  // 리뷰 데이터
  const allReviews = reviews?.reviews || reviews || [];
  const reportedReviews = allReviews.filter((r) => r.status === "reported").length;
  const approvedReviews = allReviews.filter((r) => r.status === "approved").length;
  const rejectedReviews = allReviews.filter((r) => r.status === "rejected").length;

  // 내 정보 카드의 stats 배열 생성
  const profileStats = adminInfo
    ? [
        { label: "이름", value: adminInfo.name || "관리자" },
        { label: "이메일", value: adminInfo.email || "-" },
        { label: "전화번호", value: adminInfo.phone || "-" },
      ]
    : [{ label: "로딩 중...", value: "" }];

  const dashboardCards = [
    {
      id: "statistics",
      title: "매출 통계",
      icon: <StatisticsIcon />,
      path: "/admin/statistics",
      stats: [
        { label: "총 매출", value: `${formatCurrency(totalRevenue)}원` },
        { label: "오늘 매출", value: `${formatCurrency(todayRevenue)}원` },
        { label: "이번 달 매출", value: `${formatCurrency(thisMonthRevenue)}원` },
      ],
      color: "#7FD8BE",
    },
    {
      id: "business",
      title: "사업자 관리",
      icon: <BusinessIcon />,
      path: "/admin/owners",
      stats: [
        { label: "전체 사업자", value: `${formatNumber(totalOwners)}명` },
        { label: "운영 중", value: `${formatNumber(activeOwners)}명` },
        { label: "심사 중", value: `${formatNumber(pendingOwners)}명` },
        { label: "리스크 호텔", value: `${formatNumber(riskHotels)}개`, highlight: riskHotels > 0 },
      ],
      color: "#3B82F6",
    },
    {
      id: "coupons",
      title: "쿠폰 관리",
      icon: <CouponIcon />,
      path: "/admin/coupons",
      stats: [
        { label: "전체 쿠폰", value: `${formatNumber(totalCoupons)}개` },
        { label: "활성 쿠폰", value: `${formatNumber(activeCoupons)}개` },
        { label: "사용된 쿠폰", value: `${formatNumber(usedCoupons)}건` },
      ],
      color: "#F59E0B",
    },
    {
      id: "reviews",
      title: "리뷰 관리",
      icon: <ReviewIcon />,
      path: "/admin/reviews",
      stats: [
        { label: "신고된 리뷰", value: `${formatNumber(reportedReviews)}개`, highlight: reportedReviews > 0 },
        { label: "승인된 리뷰", value: `${formatNumber(approvedReviews)}개` },
        { label: "거부된 리뷰", value: `${formatNumber(rejectedReviews)}개` },
      ],
      color: "#EF4444",
    },
    {
      id: "settings",
      title: "설정",
      icon: <SettingsIcon />,
      path: "/admin/settings",
      stats: [
        { label: "사이트 설정", value: "관리", path: "/admin/settings?tab=site" },
        { label: "운영 정책", value: "설정", path: "/admin/settings?tab=policy" },
        { label: "보안 설정", value: "관리", path: "/admin/settings?tab=security" },
        { label: "알림 설정", value: "설정", path: "/admin/settings?tab=notifications" },
      ],
      color: "#8B5CF6",
    },
    {
      id: "profile",
      title: "내 정보",
      icon: <ProfileIcon />,
      path: "/admin/profile",
      stats: profileStats,
      color: "#10B981",
    },
  ];

  return (
    <div className="business-dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">대시보드</h1>
          <p className="page-subtitle">전체 시스템 현황을 한눈에 확인하세요</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {dashboardCards.map((card) => (
          <div
            key={card.id}
            className="dashboard-card"
            onClick={() => navigate(card.path)}
            style={{ "--card-color": card.color }}
          >
            <div className="dashboard-card-header">
              <div className="dashboard-card-icon" style={{ color: card.color }}>
                {card.icon}
              </div>
              <h3 className="dashboard-card-title">{card.title}</h3>
            </div>
            <div className="dashboard-card-stats">
              {card.stats.map((stat, index) => {
                const hasPath = stat.path || stat.subPath;
                return (
                  <div
                    key={index}
                    className={`dashboard-stat ${stat.highlight ? "highlight" : ""} ${hasPath ? "clickable" : ""}`}
                    onClick={(e) => {
                      if (hasPath) {
                        e.stopPropagation();
                        navigate(stat.path || stat.subPath);
                      }
                    }}
                  >
                    <span className="dashboard-stat-label">{stat.label}</span>
                    <span className="dashboard-stat-value">{stat.value}</span>
                  </div>
                );
              })}
            </div>
            <div className="dashboard-card-footer">
              <span className="dashboard-card-link">자세히 보기 →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
