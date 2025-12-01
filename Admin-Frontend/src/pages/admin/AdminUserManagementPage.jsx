import { useEffect, useState } from "react";
import StatusBadge from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { adminUserApi } from "../../api/adminUserApi";
import { adminBusinessApi } from "../../api/adminBusinessApi";

const USER_STATUS_FILTERS = [
  { value: "all", label: "전체" },
  { value: "active", label: "활성" },
  { value: "banned", label: "정지" },
];

const BUSINESS_STATUS_FILTERS = [
  { value: "all", label: "전체" },
  { value: "approved", label: "승인됨" },
  { value: "pending", label: "심사 중" },
  { value: "suspended", label: "중지" },
  { value: "rejected", label: "거절됨" },
];

const AdminUserManagementPage = () => {
  const [activeTab, setActiveTab] = useState("users"); // "users" or "businesses"
  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [userFilters, setUserFilters] = useState({ status: "all", email: "", name: "" });
  const [userFilterInputs, setUserFilterInputs] = useState(userFilters);
  const [businessFilters, setBusinessFilters] = useState({ status: "all", search: "" });
  const [businessFilterInputs, setBusinessFilterInputs] = useState(businessFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(null);

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else {
      fetchBusinesses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, userFilters, businessFilters]);

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

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      // Business 모델의 사업자와 User 모델에서 role이 BUSINESS인 유저 모두 가져오기
      const [businessData, businessUsers] = await Promise.all([
        adminBusinessApi.getOwners({
          status: businessFilters.status !== "all" ? businessFilters.status : undefined,
          search: businessFilters.search || undefined,
        }),
        adminUserApi.getUsers({
          role: "business", // role이 business인 유저만 조회
        }),
      ]);

      // Business 모델 데이터
      const businessList = businessData.owners || [];
      
      // User 모델에서 role이 BUSINESS인 유저를 Business 형식으로 변환
      const userBusinessList = Array.isArray(businessUsers) 
        ? businessUsers.map((user) => ({
            id: user._id || user.id,
            name: user.name,
            email: user.email,
            phone: user.phoneNumber || user.phone,
            status: user.status === "active" ? "approved" : user.status === "banned" ? "suspended" : "pending",
            joinedAt: user.createdAt || user.joinedAt,
            totalHotels: 0,
            hotels: [],
            isFromUser: true, // User 모델에서 온 데이터인지 표시
          }))
        : [];

      // 두 리스트 합치기
      setBusinesses([...businessList, ...userBusinessList]);
      setError("");
    } catch (err) {
      setError(err.message || "사업자 목록을 불러오는데 실패했습니다.");
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

  const handleBusinessFilterInputChange = (key, value) => {
    setBusinessFilterInputs((prev) => ({ ...prev, [key]: value }));
  };

  const applyBusinessFilters = () => {
    setBusinessFilters(businessFilterInputs);
  };

  const resetBusinessFilters = () => {
    const defaults = { status: "all", search: "" };
    setBusinessFilterInputs(defaults);
    setBusinessFilters(defaults);
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

  const handleBusinessStatusChange = async (businessId, newStatus, isFromUser = false) => {
    try {
      if (isFromUser) {
        // User 모델에서 온 데이터인 경우 (role이 BUSINESS인 유저)
        // 상태 매핑: approved -> active, suspended -> banned, pending -> active
        const userStatus = newStatus === "suspended" ? "banned" : newStatus === "approved" ? "active" : "active";
        await adminUserApi.updateUserStatus(businessId, userStatus);
      } else {
        // Business 모델에서 온 데이터인 경우
        await adminBusinessApi.updateOwnerStatus(businessId, newStatus);
      }
      await fetchBusinesses();
      setConfirmDialog(null);
    } catch (err) {
      setError(err.message || "사업자 상태 변경에 실패했습니다.");
      setConfirmDialog(null);
    }
  };

  const openStatusChangeDialog = (type, id, currentStatus, newStatus) => {
    const statusLabels = {
      users: {
        active: "활성",
        banned: "정지",
      },
      businesses: {
        approved: "승인됨",
        pending: "심사 중",
        suspended: "중지",
        rejected: "거절됨",
      },
    };

    const newStatusLabel = statusLabels[type]?.[newStatus] || newStatus;
    const currentStatusLabel = statusLabels[type]?.[currentStatus] || currentStatus;

    setConfirmDialog({
      title: "상태 변경 확인",
      message: `이 ${type === "users" ? "유저" : "사업자"}의 상태를 "${currentStatusLabel}"에서 "${newStatusLabel}"로 변경하시겠습니까?`,
      onConfirm: () => {
        if (type === "users") {
          handleUserStatusChange(id, newStatus);
        } else {
          // isFromUser 플래그 전달
          const business = businesses.find((b) => (b._id || b.id) === id);
          handleBusinessStatusChange(id, newStatus, business?.isFromUser);
        }
      },
      onCancel: () => setConfirmDialog(null),
    });
  };

  if (loading) return <Loader fullScreen />;
  if (error && !users.length && !businesses.length) {
    return <ErrorMessage message={error} onRetry={activeTab === "users" ? fetchUsers : fetchBusinesses} />;
  }

  return (
    <div className="user-management-page">
      <div className="page-header">
        <div>
          <h1>회원 관리</h1>
          <p>일반 유저와 사업자 유저를 관리할 수 있습니다.</p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-outline"
            onClick={activeTab === "users" ? fetchUsers : fetchBusinesses}
          >
            새로고침
          </button>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="tab-menu">
        <button
          className={`tab-button ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          일반 유저
        </button>
        <button
          className={`tab-button ${activeTab === "businesses" ? "active" : ""}`}
          onClick={() => setActiveTab("businesses")}
        >
          사업자 유저
        </button>
      </div>

      {/* 일반 유저 탭 */}
      {activeTab === "users" && (
        <>
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
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone || "-"}</td>
                        <td>{user.totalBookings || 0}회</td>
                        <td>{user.lastBookingDate || "-"}</td>
                        <td>{user.createdAt || "-"}</td>
                        <td>
                          <StatusBadge status={user.status} type="user" />
                        </td>
                        <td>
                          {user.status === "active" ? (
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() =>
                                openStatusChangeDialog("users", user.id, user.status, "banned")
                              }
                            >
                              정지
                            </button>
                          ) : (
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() =>
                                openStatusChangeDialog("users", user.id, user.status, "active")
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
        </>
      )}

      {/* 사업자 유저 탭 */}
      {activeTab === "businesses" && (
        <>
          <div className="card">
            <div className="card-header">
              <h3>필터</h3>
            </div>
            <div className="filter-bar">
              <div className="filter-group grow">
                <label>검색</label>
                <input
                  type="text"
                  placeholder="사업자명 / 이메일 / 호텔명"
                  value={businessFilterInputs.search}
                  onChange={(e) => handleBusinessFilterInputChange("search", e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label>상태</label>
                <select
                  value={businessFilterInputs.status}
                  onChange={(e) => handleBusinessFilterInputChange("status", e.target.value)}
                >
                  {BUSINESS_STATUS_FILTERS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-actions">
                <button className="btn btn-primary" onClick={applyBusinessFilters}>
                  적용
                </button>
                <button className="btn btn-outline" onClick={resetBusinessFilters}>
                  초기화
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>사업자 유저 목록</h3>
              <p>총 {businesses.length}명</p>
            </div>
            {businesses.length === 0 ? (
              <EmptyState message="등록된 사업자가 없습니다." />
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>사업자명</th>
                      <th>이메일</th>
                      <th>연락처</th>
                      <th>보유 호텔</th>
                      <th>가입일</th>
                      <th>상태</th>
                      <th>작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {businesses.map((business) => {
                      const businessId = business._id || business.id;
                      return (
                        <tr key={businessId}>
                          <td>{business.name}</td>
                          <td>{business.email}</td>
                          <td>{business.phone || business.phoneNumber || "-"}</td>
                          <td>{business.totalHotels || business.hotels?.length || 0}개</td>
                          <td>{business.joinedAt || business.createdAt || "-"}</td>
                          <td>
                            <StatusBadge status={business.status} type="business" />
                          </td>
                          <td>
                            <div className="action-buttons">
                              {business.status === "pending" && (
                                <>
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={() =>
                                      openStatusChangeDialog("businesses", businessId, business.status, "approved")
                                    }
                                  >
                                    승인
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() =>
                                      openStatusChangeDialog("businesses", businessId, business.status, "rejected")
                                    }
                                  >
                                    거절
                                  </button>
                                </>
                              )}
                              {business.status === "approved" && (
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() =>
                                    openStatusChangeDialog("businesses", businessId, business.status, "suspended")
                                  }
                                >
                                  중지
                                </button>
                              )}
                              {business.status === "suspended" && (
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() =>
                                    openStatusChangeDialog("businesses", businessId, business.status, "approved")
                                  }
                                >
                                  재개
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

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

