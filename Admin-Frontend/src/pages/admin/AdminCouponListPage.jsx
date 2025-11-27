import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminCouponApi } from "../../api/adminCouponApi";
import AdminCouponFilter from "../../components/admin/coupons/AdminCouponFilter";
import AdminCouponTable from "../../components/admin/coupons/AdminCouponTable";
import Pagination from "../../components/common/Pagination";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import AlertModal from "../../components/common/AlertModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const AdminCouponListPage = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    type: "",
  });
  const [filterInputs, setFilterInputs] = useState(filters);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: "", type: "info" });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: "", onConfirm: null });

  useEffect(() => {
    fetchCoupons();
  }, [filters, currentPage]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await adminCouponApi.getCoupons({
        ...filters,
        page: currentPage,
      });
      setCoupons(data.coupons || data);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message || "쿠폰 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterInputChange = (key, value) => {
    setFilterInputs((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilters(filterInputs);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    const initial = { search: "", status: "", type: "" };
    setFilterInputs(initial);
    setFilters(initial);
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    setConfirmDialog({
      isOpen: true,
      message: "정말 이 쿠폰을 삭제하시겠습니까?",
      onConfirm: async () => {
        try {
          await adminCouponApi.deleteCoupon(id);
          setAlertModal({ isOpen: true, message: "쿠폰이 삭제되었습니다.", type: "success" });
          fetchCoupons();
        } catch (err) {
          setAlertModal({ isOpen: true, message: "쿠폰 삭제에 실패했습니다.", type: "error" });
        } finally {
          setConfirmDialog({ isOpen: false, message: "", onConfirm: null });
        }
      },
    });
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCoupons} />;

  return (
    <div className="business-coupon-list-page">
      <div className="page-header">
        <h1>쿠폰 관리</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/coupons/create")}
        >
          쿠폰 생성
        </button>
      </div>

      <AdminCouponFilter
        values={filterInputs}
        onChange={handleFilterInputChange}
        onSearch={applyFilters}
        onReset={resetFilters}
      />

      {coupons.length === 0 ? (
        <EmptyState message="쿠폰이 없습니다." />
      ) : (
        <>
          <div className="card">
            <AdminCouponTable
              coupons={coupons}
              onStatusChange={(id, status) => {
                adminCouponApi.updateCouponStatus(id, status).then(() => fetchCoupons());
              }}
              onDelete={handleDelete}
            />
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <AlertModal
        isOpen={alertModal.isOpen}
        message={alertModal.message}
        type={alertModal.type}
        onClose={() => setAlertModal({ isOpen: false, message: "", type: "info" })}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ isOpen: false, message: "", onConfirm: null })}
      />
    </div>
  );
};

export default AdminCouponListPage;

