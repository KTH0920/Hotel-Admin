import { useState, useEffect } from "react";
import { adminStatsApi } from "../../api/adminStatsApi";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
} from "recharts";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

const PERIOD_OPTIONS = [
  { value: "week", label: "주간" },
  { value: "month", label: "월간" },
  { value: "quarter", label: "분기" },
  { value: "year", label: "연간" },
];

const AdminStatisticsPage = () => {
  const [stats, setStats] = useState(null);
  const [revenueTrend, setRevenueTrend] = useState(null);
  const [period, setPeriod] = useState("month");
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
    fetchRevenueTrend("month");
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

  const fetchRevenueTrend = async (nextPeriod) => {
    try {
      setChartLoading(true);
      setPeriod(nextPeriod);
      const data = await adminStatsApi.getRevenueStats(nextPeriod);
      console.log("매출 추이 데이터:", data);
      setRevenueTrend(data);
    } catch (err) {
      console.error("매출 추이 로드 에러:", err);
      setError(err.message || "매출 추이를 불러오는데 실패했습니다.");
    } finally {
      setChartLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const formatPercent = (value) => {
    if (value === undefined || value === null) return "-";
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat("ko-KR").format(value || 0);
  };

  const chartData =
    revenueTrend?.labels && Array.isArray(revenueTrend.labels)
      ? revenueTrend.labels.map((label, index) => ({
          period: label,
          revenue: revenueTrend.revenue?.[index] ?? 0,
          bookings: revenueTrend.bookings?.[index] ?? 0,
        }))
      : [];

  if (loading && !stats) return <Loader fullScreen />;
  if (error && !stats) return <ErrorMessage message={error} onRetry={fetchStats} />;

  // 총 매출 계산 (전체 누적 매출 우선, 없으면 올해 매출)
  const totalRevenue = stats?.totalRevenue || stats?.thisYear?.revenue || 0;

  // 매출 통계 카드
  const summaryCards = stats
    ? [
        {
          title: "총 매출",
          value: formatCurrency(totalRevenue),
          subtitle: "전체 누적 매출",
          icon: "💰",
        },
        {
          title: "오늘 매출",
          value: formatCurrency(stats.today?.revenue || 0),
          delta: stats.today?.change?.revenue,
          subtitle: "전일 대비",
        },
        {
          title: "이번 달 매출",
          value: formatCurrency(stats.thisMonth?.revenue || 0),
          delta: stats.thisMonth?.change?.revenue,
          subtitle: "전월 대비",
        },
        {
          title: "올해 매출",
          value: formatCurrency(stats.thisYear?.revenue || 0),
          delta: stats.thisYear?.change?.revenue,
          subtitle: "전년 대비",
        },
      ]
    : [];

  return (
    <div className="business-statistics-page">
      <div className="page-header">
        <div>
          <h1>매출 통계</h1>
          <p>호텔 예약 및 매출 지표를 기간별로 확인합니다.</p>
        </div>
      </div>

      {summaryCards.length > 0 ? (
        <div className="stats-summary-grid">
          {summaryCards.map((card) => (
            <div className="summary-card" key={card.title}>
              <div className="summary-card__header">
                <div>
                  <p>{card.title}</p>
                  {card.subtitle && <span className="summary-card__subtitle">{card.subtitle}</span>}
                </div>
                {card.delta !== undefined && card.delta !== null && (
                  <span className={`delta ${card.invert && card.delta < 0 ? "positive" : card.delta >= 0 ? "positive" : "negative"}`}>
                    {card.delta >= 0 ? "+" : ""}
                    {(card.delta * 100).toFixed(1)}%
                  </span>
                )}
                {card.icon && <span className="summary-card__icon">{card.icon}</span>}
              </div>
              <p className="summary-card__value">{card.value}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
          <p style={{ color: "#64748b" }}>통계 데이터를 불러올 수 없습니다.</p>
          <button className="btn btn-primary" onClick={fetchStats} style={{ marginTop: "1rem" }}>
            다시 시도
          </button>
        </div>
      )}

      {stats?.hotels && stats.hotels.length > 0 && (
        <div className="statistics-section card">
          <div className="statistics-section__header">
            <div>
              <h2>호텔별 매출</h2>
              <p>보유한 호텔별 매출 현황을 확인합니다.</p>
            </div>
          </div>
          <div className="hotel-revenue-list">
            {stats.hotels.map((hotel) => {
              const totalHotelRevenue = stats.hotels.reduce((sum, h) => sum + (h.totalRevenue || 0), 0);
              const percentage = totalHotelRevenue > 0 ? (hotel.totalRevenue / totalHotelRevenue) * 100 : 0;
              return (
                <div className="hotel-revenue-item" key={hotel.id}>
                  <div className="hotel-revenue-item__header">
                    <div>
                      <p className="hotel-revenue-item__name">{hotel.name}</p>
                      <p className="hotel-revenue-item__location">{hotel.city}</p>
                    </div>
                    <div className="hotel-revenue-item__percentage">{percentage.toFixed(1)}%</div>
                  </div>
                  <div className="hotel-revenue-item__stats">
                    <div className="hotel-revenue-stat">
                      <span className="hotel-revenue-stat__label">총 매출</span>
                      <span className="hotel-revenue-stat__value">{formatCurrency(hotel.totalRevenue || 0)}</span>
                    </div>
                    <div className="hotel-revenue-stat">
                      <span className="hotel-revenue-stat__label">이번 달 매출</span>
                      <span className="hotel-revenue-stat__value">{formatCurrency(hotel.thisMonthRevenue || 0)}</span>
                      {hotel.change?.revenue !== undefined && (
                        <span className={`hotel-revenue-stat__delta ${hotel.change.revenue >= 0 ? "positive" : "negative"}`}>
                          {hotel.change.revenue >= 0 ? "+" : ""}
                          {(hotel.change.revenue * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                    <div className="hotel-revenue-stat">
                      <span className="hotel-revenue-stat__label">올해 매출</span>
                      <span className="hotel-revenue-stat__value">{formatCurrency(hotel.thisYearRevenue || 0)}</span>
                    </div>
                    <div className="hotel-revenue-stat">
                      <span className="hotel-revenue-stat__label">예약 건수</span>
                      <span className="hotel-revenue-stat__value">{hotel.bookings || 0}건</span>
                      {hotel.change?.bookings !== undefined && (
                        <span className={`hotel-revenue-stat__delta ${hotel.change.bookings >= 0 ? "positive" : "negative"}`}>
                          {hotel.change.bookings >= 0 ? "+" : ""}
                          {(hotel.change.bookings * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="hotel-revenue-item__bar">
                    <div
                      className="hotel-revenue-item__bar-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="statistics-section card">
        <div className="statistics-section__header">
          <div>
            <h2>매출 추이</h2>
            <p>기간별 매출과 예약 수를 비교해 보세요.</p>
          </div>
          <div className="chart-filter-group">
            {PERIOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`chart-filter-btn ${period === option.value ? "active" : ""}`}
                onClick={() => fetchRevenueTrend(option.value)}
                disabled={chartLoading && period === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {stats?.trendComparison && (
          <div className="trend-summary">
            <div>
              <p className="label">이번 기간 매출</p>
              <p className="value">{formatCurrency(stats.trendComparison.current)}</p>
            </div>
            <div>
              <p className="label">전 기간</p>
              <p className="value muted">{formatCurrency(stats.trendComparison.previous)}</p>
            </div>
            <div className={`trend-badge ${stats.trendComparison.yoyChange >= 0 ? "positive" : "negative"}`}>
              {stats.trendComparison.yoyChange >= 0 ? "▲" : "▼"} {(stats.trendComparison.yoyChange * 100).toFixed(1)}% YoY
            </div>
          </div>
        )}

        <div className="chart-wrapper">
          {chartLoading && (
            <div className="chart-overlay">
              <div className="chart-spinner" />
            </div>
          )}
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={chartData} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="period" tick={{ fill: "#6b7280" }} />
              <YAxis
                yAxisId="left"
                tickFormatter={(value) => `${Math.round(value / 10000)}만`}
                tick={{ fill: "#6b7280" }}
              />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#6b7280" }} />
              <Tooltip
                formatter={(value, name) =>
                  name === "매출" ? [`${formatCurrency(value)}원`, name] : [`${value}건`, name]
                }
              />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" name="매출" fill="#7FD8BE" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="bookings"
                name="예약 수"
                stroke="#F97316"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminStatisticsPage;

