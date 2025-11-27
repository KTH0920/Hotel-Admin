const AdminCouponFilter = ({ values, onChange, onSearch, onReset }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.();
  };

  return (
    <form className="filter-bar coupon-filter" onSubmit={handleSubmit}>
      <div className="filter-group grow">
        <label>검색</label>
        <input
          type="text"
          placeholder="쿠폰명 또는 쿠폰 코드"
          value={values.search || ""}
          onChange={(e) => onChange("search", e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>상태</label>
        <select
          value={values.status || ""}
          onChange={(e) => onChange("status", e.target.value)}
        >
          <option value="">전체</option>
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
          <option value="expired">만료</option>
        </select>
      </div>

      <div className="filter-group">
        <label>할인 유형</label>
        <select
          value={values.type || ""}
          onChange={(e) => onChange("type", e.target.value)}
        >
          <option value="">전체</option>
          <option value="percentage">퍼센트</option>
          <option value="fixed">고정 금액</option>
        </select>
      </div>

      <div className="filter-actions">
        <button type="submit" className="btn btn-primary">
          검색
        </button>
        <button type="button" className="btn btn-outline" onClick={onReset}>
          초기화
        </button>
      </div>
    </form>
  );
};

export default AdminCouponFilter;

