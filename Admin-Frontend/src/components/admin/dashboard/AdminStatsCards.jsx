const AdminStatsCards = ({ stats }) => {
  if (!stats) return null;

  const { hotel } = stats;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ko-KR").format(amount);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat("ko-KR").format(value);
  };

  return (
    <div className="stats-cards">
      <div className="stat-card">
        <div className="stat-card-header">
          <p className="stat-label">총 매출</p>
          <span className="stat-icon icon-money">💰</span>
        </div>
        <p className="stat-value">{formatCurrency(hotel.totalRevenue)}원</p>
        <p className="stat-change positive">+8% 전월 대비</p>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <p className="stat-label">총 회원</p>
          <span className="stat-icon icon-users">👥</span>
        </div>
        <p className="stat-value">{formatNumber(hotel.totalMembers || 0)}명</p>
        <p className="stat-change positive">신규 가입 {formatNumber(hotel.newMembers || 0)}명/월</p>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <p className="stat-label">활성 객실</p>
          <span className="stat-icon icon-hotel">🏨</span>
        </div>
        <p className="stat-value">{hotel.totalRooms}개</p>
        <p className="stat-change positive">평균 평점 {hotel.avgRating || 4.5}</p>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <p className="stat-label">총 리뷰</p>
          <span className="stat-icon icon-review">⭐</span>
        </div>
        <p className="stat-value">{hotel.totalReviews || 128}개</p>
        <p className="stat-change positive">평균 {hotel.avgRating || 4.5}점</p>
      </div>
    </div>
  );
};

export default AdminStatsCards;

