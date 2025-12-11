import { useState, useEffect } from "react";
import { adminAuthApi } from "../../api/adminAuthApi";
import AdminProfileForm from "../../components/admin/settings/AdminProfileForm";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import AlertModal from "../../components/common/AlertModal";

const AdminMyProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: "", type: "info" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await adminAuthApi.getMyInfo();
      setProfile(data);
    } catch (err) {
      setError(err.message || "프로필 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    // 프로필 업데이트 기능은 현재 지원하지 않습니다.
    setAlertModal({ isOpen: true, message: "프로필 수정 기능은 현재 지원하지 않습니다.", type: "info" });
  };

  if (loading) return <Loader fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProfile} />;

  return (
    <div className="business-my-profile-page">
      <div className="page-header">
        <h1>내 프로필</h1>
      </div>

      <div className="card">
        <AdminProfileForm profile={profile} onSubmit={handleSubmit} />
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

export default AdminMyProfilePage;

