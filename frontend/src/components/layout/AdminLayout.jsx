import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AdminAuthContext } from "../../context/AdminAuthContext";
import AdminSidebar from "./AdminSidebar";
import "../../styles/index.scss";

const AdminLayout = () => {
  const { adminInfo, loading, logout } = useContext(AdminAuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="business-layout">
        <div className="container" style={{ padding: "2rem", textAlign: "center" }}>
          로딩 중...
        </div>
      </div>
    );
  }

  if (!adminInfo) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="business-layout-sidebar">
      <AdminSidebar />
      <div className="business-main">
        <header className="business-topbar">
          <h2>관리자 대시보드</h2>
          <div className="topbar-user">
            <span>{adminInfo?.name || "관리자"}</span>
            <button onClick={handleLogout} className="btn-logout">
              로그아웃
            </button>
          </div>
        </header>
        <main className="business-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

