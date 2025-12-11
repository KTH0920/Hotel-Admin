import { Link } from "react-router-dom";

const AdminRecentTable = ({ bookings = [] }) => {
  const getStatusText = (status) => {
    const statusMap = {
      confirmed: "확정",
      pending: "대기",
      cancelled: "취소",
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    const classMap = {
      confirmed: "status-confirmed",
      pending: "status-pending",
      cancelled: "status-cancelled",
    };
    return classMap[status] || "";
  };

  return (
    <div className="recent-table">
      <p className="table-subtitle">최근 예약</p>
      <table>
        <thead>
          <tr>
            <th>예약번호</th>
            <th>호텔명</th>
            <th>고객명</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>
                <Link to={`/admin/bookings/${booking.id}`} className="link-primary">
                  {booking.id}
                </Link>
              </td>
              <td>{booking.hotelName || "서울 그랜드 호텔"}</td>
              <td>{booking.guestName}</td>
              <td>
                <span className={getStatusClass(booking.status)}>
                  {getStatusText(booking.status)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminRecentTable;

