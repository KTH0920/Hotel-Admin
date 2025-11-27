import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminCouponApi } from "../../api/adminCouponApi";
import AdminCouponForm from "../../components/admin/coupons/AdminCouponForm";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import AlertModal from "../../components/common/AlertModal";

const AdminCouponEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: "", type: "info" });

  useEffect(() => {
    fetchCoupon();
  }, [id]);

  const fetchCoupon = async () => {
    try {
      setLoading(true);
      const data = await adminCouponApi.getCouponById(id);
      setCoupon(data);
    } catch (err) {
      setError(err.message || "쿠폰 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      await adminCouponApi.updateCoupon(id, formData);
      setAlertModal({
        isOpen: true,
        message: "쿠폰이 수정되었습니다.",
        type: "success",
      });
      setTimeout(() => {
        navigate("/admin/coupons");
      }, 1500);
    } catch (err) {
      setAlertModal({
        isOpen: true,
        message: err.message || "쿠폰 수정에 실패했습니다.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/coupons");
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCoupon} />;
  if (!coupon) return <ErrorMessage message="쿠폰을 찾을 수 없습니다." />;

  return (
    <div className="business-coupon-edit-page">
      <div className="page-header">
        <h1>쿠폰 수정</h1>
      </div>

      <div className="card">
        <AdminCouponForm
          coupon={coupon}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={saving}
        />
      </div>

      <AlertModal
        isOpen={alertModal.isOpen}
        message={alertModal.message}
        type={alertModal.type}
        onClose={() => setAlertModal({ isOpen: false, message: "", type: "info" })}
      />
    </div>
  );
};

export default AdminCouponEditPage;

