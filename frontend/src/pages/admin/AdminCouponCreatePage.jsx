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

  // 프론트엔드 폼 데이터를 백엔드 모델 형식으로 변환
  const transformFormDataToBackend = (formData) => {
    const backendData = {
      title: formData.name, // name → title
      code: formData.code,
      validUntil: new Date(formData.validTo), // validTo → validUntil (Date 객체)
      isActive: formData.status === "active", // status → isActive (boolean)
    };

    // 할인 설정: 백엔드는 discountPercentage만 지원
    if (formData.type === "percentage") {
      backendData.discountPercentage = formData.value;
    } else {
      // 고정 금액 할인은 백엔드에서 지원하지 않으므로 퍼센트로 변환하거나 에러 처리
      // 일단 퍼센트 할인만 지원하도록 함
      throw new Error("현재는 퍼센트 할인만 지원합니다.");
    }

    // 선택적 필드
    if (formData.description) {
      backendData.description = formData.description;
    }

    return backendData;
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const backendData = transformFormDataToBackend(formData);
      await adminCouponApi.createCoupon(backendData);
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

