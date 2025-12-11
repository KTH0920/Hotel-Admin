import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AdminAuthContext } from "../../context/AdminAuthContext";

const AdminHeader = () => {
  const { adminInfo, logout } = useContext(AdminAuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <header className="business-header">
      <div className="container">
        <div className="business-header__inner">
          <Link to="/admin/dashboard" className="business-header__logo">
            <h1>Hotelhub Business</h1>
          </Link>

          <nav className="business-header__nav">
            <Link
              to="/admin/dashboard"
              className={`business-header__nav-link ${isActive("/admin/dashboard")}`}
            >
              대시보드
            </Link>
            <Link
              to="/admin/rooms"
              className={`business-header__nav-link ${isActive("/admin/rooms")}`}
            >
              객실 관리
            </Link>
            <Link
              to="/admin/statistics"
              className={`business-header__nav-link ${isActive("/admin/statistics")}`}
            >
              매출 통계
            </Link>
            <Link
              to="/admin/reviews"
              className={`business-header__nav-link ${isActive("/admin/reviews")}`}
            >
              리뷰 관리
            </Link>
          </nav>

          <div className="business-header__user">
            {adminInfo && (
              <>
                <div className="business-header__user-info">
                  <div className="business-header__user-avatar">
                    {adminInfo.name?.charAt(0) || "A"}
                  </div>
                  <span className="business-header__user-name">
                    {adminInfo.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="business-header__logout"
                >
                  로그아웃
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

