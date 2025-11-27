import { useEffect, useMemo, useState } from "react";
import StatusBadge from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import { adminBusinessApi } from "../../api/adminBusinessApi";

const STATUS_FILTERS = [
  { value: "all", label: "전체" },
  { value: "active", label: "운영 중" },
  { value: "pending", label: "심사 중" },
  { value: "suspended", label: "중지" },
];

const AdminBusinessManagementPage = () => {
  const [owners, setOwners] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filters, setFilters] = useState({ status: "all", search: "" });
  const [filterInputs, setFilterInputs] = useState(filters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOwners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const data = await adminBusinessApi.getOwners({
        status: filters.status,
        search: filters.search || undefined,
      });
      setOwners(data.owners || []);
      setSummary(data.summary || null);
      setError("");
    } catch (err) {
      setError(err.message || "사업자 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterInputChange = (key, value) => {
    setFilterInputs((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilters(filterInputs);
  };

  const resetFilters = () => {
    const defaults = { status: "all", search: "" };
    setFilterInputs(defaults);
    setFilters(defaults);
  };

  const aggregatedHotels = useMemo(() => {
    return owners.reduce((list, owner) => {
      const mapped = owner.hotels?.map((hotel) => ({
        ...hotel,
        ownerName: owner.name,
        ownerStatus: owner.status,
      }));
      return list.concat(mapped || []);
    }, []);
  }, [owners]);

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchOwners} />;

  return (
    <div className="business-owner-management-page">
      <div className="page-header">
        <div>
          <h1>사업자 관리</h1>
          <p>사업자별 호텔 운영 현황과 리스크를 한눈에 확인하세요.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-outline" onClick={fetchOwners}>
            새로고침
          </button>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-card-header">
            <p className="stat-label">전체 사업자</p>
          </div>
          <p className="stat-value">{summary?.totalOwners ?? owners.length}명</p>
          <p className="stat-change positive">호텔 {summary?.totalHotels ?? aggregatedHotels.length}개 운영</p>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <p className="stat-label">운영 중</p>
          </div>
          <p className="stat-value">{summary?.activeOwners ?? 0}명</p>
          <p className="stat-change positive">안정적으로 운영 중</p>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <p className="stat-label">심사 중</p>
          </div>
          <p className="stat-value">{summary?.pendingOwners ?? 0}명</p>
          <p className="stat-change">등록 서류 검토 진행</p>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <p className="stat-label">리스크 호텔</p>
          </div>
          <p className="stat-value">{summary?.riskHotels ?? 0}개</p>
          <p className="stat-change negative">점검 필요</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>필터</h3>
        </div>
        <div className="filter-bar owner-filter">
          <div className="filter-group grow">
            <label>검색</label>
            <input
              type="text"
              placeholder="사업자명 / 이메일 / 호텔명"
              value={filterInputs.search}
              onChange={(e) => handleFilterInputChange("search", e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>상태</label>
            <select
              value={filterInputs.status}
              onChange={(e) => handleFilterInputChange("status", e.target.value)}
            >
              {STATUS_FILTERS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-actions">
            <button className="btn btn-primary" onClick={applyFilters}>
              적용
            </button>
            <button className="btn btn-outline" onClick={resetFilters}>
              초기화
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>사업자 목록</h3>
        </div>
        {owners.length === 0 ? (
          <EmptyState message="등록된 사업자가 없습니다." />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>사업자</th>
                  <th>연락처</th>
                  <th>보유 호텔</th>
                  <th>최근 점검 상태</th>
                  <th>이슈</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {owners.map((owner) => {
                  const primaryHotel = owner.hotels?.[0];
                  return (
                    <tr key={owner.id}>
                      <td>
                        <p className="owner-name">{owner.name}</p>
                        <p className="owner-meta">{owner.email}</p>
                      </td>
                      <td>
                        <p>{owner.phone || "-"}</p>
                        <p className="owner-meta">가입일 {owner.joinedAt}</p>
                      </td>
                      <td>
                        <p>
                          {owner.totalHotels || owner.hotels?.length || 0}개
                        </p>
                        {primaryHotel && (
                          <p className="owner-meta">
                            대표 호텔: {primaryHotel.name}
                          </p>
                        )}
                      </td>
                      <td>
                        {primaryHotel ? (
                          <>
                            <p>{primaryHotel.status === "operating" ? "정상 운영" : "점검 필요"}</p>
                            <p className="owner-meta">
                              점검일 {primaryHotel.lastInspection || "-"}
                            </p>
                          </>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        {primaryHotel ? (
                          <span className={`risk-indicator ${primaryHotel.issues > 0 ? "danger" : "success"}`}>
                            {primaryHotel.issues > 0 ? `${primaryHotel.issues}건` : "이슈 없음"}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        <StatusBadge status={owner.status} type="business" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <h3>호텔 상세 현황</h3>
          <p>사업자와 관계없이 전체 호텔 상태를 빠르게 확인하세요.</p>
        </div>
        {aggregatedHotels.length === 0 ? (
          <EmptyState message="연결된 호텔 정보가 없습니다." />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>호텔명</th>
                  <th>지역</th>
                  <th>점유율</th>
                  <th>객실 수</th>
                  <th>최근 점검</th>
                  <th>사업자</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {aggregatedHotels.map((hotel) => (
                  <tr key={`${hotel.id}-${hotel.ownerName}`}>
                    <td>{hotel.name}</td>
                    <td>{hotel.city}</td>
                    <td>{Math.round((hotel.occupancy || 0) * 100)}%</td>
                    <td>{hotel.rooms}개</td>
                    <td>{hotel.lastInspection || "-"}</td>
                    <td>{hotel.ownerName}</td>
                    <td>
                      <span
                        className={`hotel-status ${hotel.status}`}
                      >
                        {hotel.status === "operating"
                          ? "운영 중"
                          : hotel.status === "review"
                            ? "심사 중"
                            : "중단"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBusinessManagementPage;

