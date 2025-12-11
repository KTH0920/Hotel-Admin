import { useEffect, useState } from "react";
import StatusBadge from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { adminUserApi } from "../../api/adminUserApi";

const USER_STATUS_FILTERS = [
  { value: "all", label: "전체" },
  { value: "active", label: "활성" },
  { value: "banned", label: "정지" },
];

const AdminUserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [userFilters, setUserFilters] = useState({ status: "all", email: "", name: "" });
  const [userFilterInputs, setUserFilterInputs] = useState(userFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(null);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFilters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // 일반 유저만 조회 (role이 business가 아닌 유저)
      const data = await adminUserApi.getUsers({
        status: userFilters.status !== "all" ? userFilters.status : undefined,
        email: userFilters.email || undefined,
        name: userFilters.name || undefined,
        role: "user", // 일반 유저만 조회
      });
      setUsers(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err.message || "일반 유저 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleUserFilterInputChange = (key, value) => {
    setUserFilterInputs((prev) => ({ ...prev, [key]: value }));
  };

  const applyUserFilters = () => {
    setUserFilters(userFilterInputs);
  };

  const resetUserFilters = () => {
    const defaults = { status: "all", email: "", name: "" };
    setUserFilterInputs(defaults);
    setUserFilters(defaults);
  };

  const handleUserStatusChange = async (userId, newStatus) => {
    try {
      await adminUserApi.updateUserStatus(userId, newStatus);
      await fetchUsers();
      setConfirmDialog(null);
    } catch (err) {
      setError(err.message || "유저 상태 변경에 실패했습니다.");
      setConfirmDialog(null);
    }
  };

  const openStatusChangeDialog = (id, currentStatus, newStatus) => {
    const statusLabels = {
      active: "활성",
      banned: "정지",
    };

    const newStatusLabel = statusLabels[newStatus] || newStatus;
    const currentStatusLabel = statusLabels[currentStatus] || currentStatus;

    setConfirmDialog({
      title: "상태 변경 확인",
      message: `이 유저의 상태를 "${currentStatusLabel}"에서 "${newStatusLabel}"로 변경하시겠습니까?`,
      onConfirm: () => {
        handleUserStatusChange(id, newStatus);
      },
      onCancel: () => setConfirmDialog(null),
    });
  };

  if (loading) return <Loader fullScreen />;
  if (error && !users.length) {
    return <ErrorMessage message={error} onRetry={fetchUsers} />;
  }

  return (
    <div className="user-management-page">
      <div className="page-header">
        <div>
          <h1>회원 관리</h1>
          <p>일반 유저를 관리할 수 있습니다.</p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-outline"
            onClick={fetchUsers}
          >
            새로고침
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>필터</h3>
        </div>
        <div className="filter-bar">
          <div className="filter-group grow">
            <label>이메일</label>
            <input
              type="text"
              placeholder="이메일로 검색"
              value={userFilterInputs.email}
              onChange={(e) => handleUserFilterInputChange("email", e.target.value)}
            />
          </div>
          <div className="filter-group grow">
            <label>이름</label>
            <input
              type="text"
              placeholder="이름으로 검색"
              value={userFilterInputs.name}
              onChange={(e) => handleUserFilterInputChange("name", e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>상태</label>
            <select
              value={userFilterInputs.status}
              onChange={(e) => handleUserFilterInputChange("status", e.target.value)}
            >
              {USER_STATUS_FILTERS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-actions">
            <button className="btn btn-primary" onClick={applyUserFilters}>
              적용
            </button>
            <button className="btn btn-outline" onClick={resetUserFilters}>
              초기화
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>일반 유저 목록</h3>
          <p>총 {users.length}명</p>
        </div>
        {users.length === 0 ? (
          <EmptyState message="등록된 일반 유저가 없습니다." />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>이름</th>
                  <th>이메일</th>
                  <th>연락처</th>
                  <th>예약 횟수</th>
                  <th>최근 예약일</th>
                  <th>가입일</th>
                  <th>상태</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id || user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || user.phoneNumber || "-"}</td>
                    <td>{user.totalBookings || 0}회</td>
                    <td>{user.lastBookingDate || "-"}</td>
                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
                    <td>
                      <StatusBadge status={user.status} type="user" />
                    </td>
                    <td>
                      {user.status === "active" ? (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            openStatusChangeDialog(user.id || user._id, user.status, "banned")
                          }
                        >
                          정지
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() =>
                            openStatusChangeDialog(user.id || user._id, user.status, "active")
                          }
                        >
                          활성화
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirmDialog && (
        <ConfirmDialog
          isOpen={!!confirmDialog}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={confirmDialog.onCancel}
        />
      )}
    </div>
  );
};

export default AdminUserManagementPage;

