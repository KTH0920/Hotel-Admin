import { Link } from "react-router-dom";
import StatusBadge from "../../common/StatusBadge";

const AdminCouponTable = ({ coupons, onStatusChange, onDelete }) => {
  const formatCurrency = (amount) =>
    `${new Intl.NumberFormat("ko-KR").format(amount)}원`;

  const formatDiscount = (coupon) => {
    // 백엔드 모델: discountPercentage 사용
    if (coupon.discountPercentage !== undefined) {
      return `${coupon.discountPercentage}%`;
    }
    // 프론트엔드 형식도 지원
    if (coupon.type === "percentage") {
      return `${coupon.value}%`;
    }
    if (coupon.value) {
      return formatCurrency(coupon.value);
    }
    return "-";
  };

  return (
    <div className="table-wrapper coupon-table">
      <table>
        <thead>
          <tr>
            <th>쿠폰명</th>
            <th>쿠폰 코드</th>
            <th>할인</th>
            <th>최소 금액</th>
            <th>유효 기간</th>
            <th>사용량</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => {
            const couponId = coupon.id || coupon._id;
            return (
              <tr key={couponId}>
                <td>
                  <Link to={`/admin/coupons/${couponId}`} className="link-primary">
                    {coupon.name || coupon.title}
                  </Link>
                </td>
                <td>
                  <code style={{ background: "#f1f5f9", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>
                    {coupon.code}
                  </code>
                </td>
                <td>{formatDiscount(coupon)}</td>
                <td>{coupon.minAmount ? formatCurrency(coupon.minAmount) : "-"}</td>
                <td>
                  <div style={{ fontSize: "0.875rem" }}>
                    <div>{coupon.validFrom || new Date(coupon.createdAt).toLocaleDateString()}</div>
                    <div style={{ color: "#64748b" }}>~ {coupon.validTo || new Date(coupon.validUntil).toLocaleDateString()}</div>
                  </div>
                </td>
                <td>
                  {coupon.usedCount || 0} / {coupon.usageLimit || "∞"}
                </td>
                <td>
                  <StatusBadge status={coupon.status || (coupon.isActive ? "active" : "inactive")} type="coupon" />
                </td>
                <td>
                  <div className="coupon-actions">
                    <Link
                      to={`/admin/coupons/${couponId}/edit`}
                      className="btn btn-sm btn-outline"
                    >
                      수정
                    </Link>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => onDelete(couponId)}
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCouponTable;

