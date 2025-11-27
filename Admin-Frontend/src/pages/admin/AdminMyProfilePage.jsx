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
    try {
      await adminAuthApi.updateProfile(data);
      setAlertModal({ isOpen: true, message: "프로필이 저장되었습니다.", type: "success" });
      fetchProfile();
    } catch (err) {
      setAlertModal({ isOpen: true, message: "저장에 실패했습니다.", type: "error" });
    }
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

