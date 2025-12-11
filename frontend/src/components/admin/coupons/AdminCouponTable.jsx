import { Link } from "react-router-dom";
import StatusBadge from "../../common/StatusBadge";

const AdminCouponTable = ({ coupons, onStatusChange, onDelete }) => {
  const formatCurrency = (amount) =>
    `${new Intl.NumberFormat("ko-KR").format(amount)}원`;

  const formatDiscount = (coupon) => {
    if (coupon.type === "percentage") {
      return `${coupon.value}%`;
    }
    return formatCurrency(coupon.value);
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
          {coupons.map((coupon) => (
            <tr key={coupon.id}>
              <td>
                <Link to={`/admin/coupons/${coupon.id}`} className="link-primary">
                  {coupon.name}
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
                  <div>{coupon.validFrom}</div>
                  <div style={{ color: "#64748b" }}>~ {coupon.validTo}</div>
                </div>
              </td>
              <td>
                {coupon.usedCount} / {coupon.usageLimit || "∞"}
              </td>
              <td>
                <StatusBadge status={coupon.status} type="coupon" />
              </td>
              <td>
                <div className="coupon-actions">
                  <Link
                    to={`/admin/coupons/${coupon.id}/edit`}
                    className="btn btn-sm btn-outline"
                  >
                    수정
                  </Link>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(coupon.id)}
                  >
                    삭제
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCouponTable;

