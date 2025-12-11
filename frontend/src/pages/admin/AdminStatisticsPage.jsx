import { useState, useEffect } from "react";
import { adminStatsApi } from "../../api/adminStatsApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const AdminStatisticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminStatsApi.getStatistics();
      console.log("통계 데이터:", data);
      setStats(data);
    } catch (err) {
      console.error("통계 로드 에러:", err);
      setError(err.message || "통계를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat("ko-KR").format(value || 0);
  };

  const formatPercent = (value) => {
    if (value === undefined || value === null) return "-";
    return `${(value * 100).toFixed(1)}%`;
  };

  if (loading && !stats) return <Loader fullScreen />;
  if (error && !stats) return <ErrorMessage message={error} onRetry={fetchStats} />;

  // 종합 운영 통계 카드
  const summaryCards = stats
    ? [
        // 회원 통계
        {
          title: "전체 회원",
          value: formatNumber(stats.users?.total || 0),
          subtitle: "전체 가입 회원 수",
          icon: "👥",
        },
        {
          title: "활성 회원",
          value: formatNumber(stats.users?.active || 0),
          subtitle: "정상 이용 중인 회원",
          icon: "✅",
        },
        {
          title: "신규 가입자",
          value: formatNumber(stats.users?.today || 0),
          delta: stats.users?.change?.today,
          subtitle: "오늘 가입한 회원",
        },
        // 사업자 통계
        {
          title: "전체 사업자",
          value: formatNumber(stats.businesses?.total || 0),
          subtitle: "전체 등록 사업자 수",
          icon: "🏢",
        },
        {
          title: "승인 대기",
          value: formatNumber(stats.businesses?.pending || 0),
          subtitle: "심사 중인 사업자",
          icon: "⏳",
        },
        {
          title: "승인됨",
          value: formatNumber(stats.businesses?.approved || 0),
          subtitle: "운영 중인 사업자",
          icon: "✓",
        },
        // 리뷰 통계
        {
          title: "전체 리뷰",
          value: formatNumber(stats.reviews?.total || 0),
          subtitle: "작성된 리뷰 수",
          icon: "⭐",
        },
        {
          title: "평균 평점",
          value: stats.reviews?.averageRating ? `${stats.reviews.averageRating.toFixed(1)}점` : "0점",
          subtitle: "전체 리뷰 평균",
          icon: "📊",
        },
        {
          title: "신고된 리뷰",
          value: formatNumber(stats.reviews?.reported || 0),
          subtitle: "처리 대기 중",
          icon: "⚠️",
        },
        // 쿠폰 통계
        {
          title: "활성 쿠폰",
          value: formatNumber(stats.promotions?.active || 0),
          subtitle: "사용 가능한 쿠폰",
          icon: "🎫",
        },
        {
          title: "만료된 쿠폰",
          value: formatNumber(stats.promotions?.expired || 0),
          subtitle: "유효기간 만료",
          icon: "⏰",
        },
      ]
    : [];

  return (
    <div className="business-statistics-page">
      <div className="page-header">
        <div>
          <h1>운영 통계</h1>
          <p>회원, 사업자, 리뷰, 쿠폰 등 전체 운영 현황을 확인합니다.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-outline" onClick={fetchStats}>
            새로고침
          </button>
        </div>
      </div>

      {summaryCards.length > 0 ? (
        <>
          {/* 회원 통계 섹션 */}
          <div className="statistics-section card">
            <div className="statistics-section__header">
              <h2>회원 통계</h2>
              <p>전체 회원 및 신규 가입 현황</p>
            </div>
            <div className="stats-summary-grid">
              {summaryCards.slice(0, 3).map((card) => (
                <div className="summary-card" key={card.title}>
                  <div className="summary-card__header">
                    <div>
                      <p>{card.title}</p>
                      {card.subtitle && <span className="summary-card__subtitle">{card.subtitle}</span>}
                    </div>
                    {card.delta !== undefined && card.delta !== null && (
                      <span className={`delta ${card.delta >= 0 ? "positive" : "negative"}`}>
                        {card.delta >= 0 ? "+" : ""}
                        {formatPercent(card.delta)}
                      </span>
                    )}
                    {card.icon && <span className="summary-card__icon">{card.icon}</span>}
                  </div>
                  <p className="summary-card__value">{card.value}</p>
                </div>
              ))}
            </div>
            {stats?.users?.thisMonth !== undefined && (
              <div className="stats-additional-info">
                <p>이번 달 신규 가입: <strong>{formatNumber(stats.users.thisMonth)}명</strong></p>
                {stats.users.change?.thisMonth !== undefined && (
                  <span className={`delta ${stats.users.change.thisMonth >= 0 ? "positive" : "negative"}`}>
                    {stats.users.change.thisMonth >= 0 ? "+" : ""}
                    {formatPercent(stats.users.change.thisMonth)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 사업자 통계 섹션 */}
          <div className="statistics-section card">
            <div className="statistics-section__header">
              <h2>사업자 통계</h2>
              <p>사업자 등록 및 승인 현황</p>
            </div>
            <div className="stats-summary-grid">
              {summaryCards.slice(3, 6).map((card) => (
                <div className="summary-card" key={card.title}>
                  <div className="summary-card__header">
                    <div>
                      <p>{card.title}</p>
                      {card.subtitle && <span className="summary-card__subtitle">{card.subtitle}</span>}
                    </div>
                    {card.icon && <span className="summary-card__icon">{card.icon}</span>}
                  </div>
                  <p className="summary-card__value">{card.value}</p>
                </div>
              ))}
            </div>
            {stats?.businesses?.thisMonth !== undefined && (
              <div className="stats-additional-info">
                <p>이번 달 신규 등록: <strong>{formatNumber(stats.businesses.thisMonth)}명</strong></p>
              </div>
            )}
          </div>

          {/* 리뷰 통계 섹션 */}
          <div className="statistics-section card">
            <div className="statistics-section__header">
              <h2>리뷰 통계</h2>
              <p>리뷰 작성 및 관리 현황</p>
            </div>
            <div className="stats-summary-grid">
              {summaryCards.slice(6, 9).map((card) => (
                <div className="summary-card" key={card.title}>
                  <div className="summary-card__header">
                    <div>
                      <p>{card.title}</p>
                      {card.subtitle && <span className="summary-card__subtitle">{card.subtitle}</span>}
                    </div>
                    {card.icon && <span className="summary-card__icon">{card.icon}</span>}
                  </div>
                  <p className="summary-card__value">{card.value}</p>
                </div>
              ))}
            </div>
            {stats?.reviews?.thisMonth !== undefined && (
              <div className="stats-additional-info">
                <p>이번 달 신규 리뷰: <strong>{formatNumber(stats.reviews.thisMonth)}개</strong></p>
              </div>
            )}
          </div>

          {/* 쿠폰 통계 섹션 */}
          <div className="statistics-section card">
            <div className="statistics-section__header">
              <h2>쿠폰 통계</h2>
              <p>프로모션 및 쿠폰 현황</p>
            </div>
            <div className="stats-summary-grid">
              {summaryCards.slice(9, 11).map((card) => (
                <div className="summary-card" key={card.title}>
                  <div className="summary-card__header">
                    <div>
                      <p>{card.title}</p>
                      {card.subtitle && <span className="summary-card__subtitle">{card.subtitle}</span>}
                    </div>
                    {card.icon && <span className="summary-card__icon">{card.icon}</span>}
                  </div>
                  <p className="summary-card__value">{card.value}</p>
                </div>
              ))}
            </div>
            {stats?.promotions?.total !== undefined && (
              <div className="stats-additional-info">
                <p>전체 쿠폰: <strong>{formatNumber(stats.promotions.total)}개</strong></p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
          <p style={{ color: "#64748b" }}>통계 데이터를 불러올 수 없습니다.</p>
          <button className="btn btn-primary" onClick={fetchStats} style={{ marginTop: "1rem" }}>
            다시 시도
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminStatisticsPage;

