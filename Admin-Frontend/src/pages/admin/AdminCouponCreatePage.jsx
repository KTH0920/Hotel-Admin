import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminCouponApi } from "../../api/adminCouponApi";
import AdminCouponForm from "../../components/admin/coupons/AdminCouponForm";
import Loader from "../../components/common/Loader";
import AlertModal from "../../components/common/AlertModal";

const AdminCouponCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: "", type: "info" });

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await adminCouponApi.createCoupon(formData);
      setAlertModal({
        isOpen: true,
        message: "쿠폰이 생성되었습니다.",
        type: "success",
      });
      setTimeout(() => {
        navigate("/admin/coupons");
      }, 1500);
    } catch (err) {
      setAlertModal({
        isOpen: true,
        message: err.message || "쿠폰 생성에 실패했습니다.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/coupons");
  };

  return (
    <div className="business-coupon-create-page">
      <div className="page-header">
        <h1>쿠폰 생성</h1>
      </div>

      <div className="card">
        <AdminCouponForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
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

export default AdminCouponCreatePage;

