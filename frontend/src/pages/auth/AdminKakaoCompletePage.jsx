import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { adminAuthApi } from "../../api/adminAuthApi";

const AdminKakaoCompletePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // URL에서 임시 토큰이나 정보가 있으면 가져오기
    const tempUserId = searchParams.get("tempUserId");
    if (!tempUserId) {
      // 임시 사용자 정보가 없으면 로그인 페이지로 리다이렉트
      navigate("/admin/login");
    }
  }, [searchParams, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 관리자 등록번호 형식 체크 (XXX-XX-XXXXX)
    const businessNumberPattern = /^\d{3}-\d{2}-\d{5}$/;
    if (!businessNumberPattern.test(formData.businessNumber)) {
      setError("관리자 등록번호 형식이 올바르지 않습니다. (예: 123-45-67890)");
      setLoading(false);
      return;
    }

    // 핸드폰 번호 형식 체크 (XXX-XXXX-XXXX)
    const phonePattern = /^\d{3}-\d{4}-\d{4}$/;
    if (!phonePattern.test(formData.phone)) {
      setError("핸드폰 번호 형식이 올바르지 않습니다. (예: 010-1234-5678)");
      setLoading(false);
      return;
    }

    try {
      const tempUserId = searchParams.get("tempUserId");
      const data = await adminAuthApi.completeKakaoSignup({
        ...formData,
        tempUserId,
      });
      
      // 로그인 처리
      localStorage.setItem("businessToken", data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "회원가입 완료에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-page">
      <div className="auth-split-form">
        <div className="auth-form-container">
          <h1>추가 정보 입력</h1>
          <p className="auth-subtitle">카카오 로그인을 완료하기 위해 추가 정보를 입력해주세요</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">이름</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="enter your name..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="enter your email..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">핸드폰 번호</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="010-1234-5678"
                required
                pattern="\d{3}-\d{4}-\d{4}"
              />
            </div>

            <div className="form-group">
              <label htmlFor="businessNumber">관리자 등록번호</label>
              <input
                type="text"
                id="businessNumber"
                name="businessNumber"
                value={formData.businessNumber}
                onChange={handleChange}
                placeholder="123-45-67890"
                required
                pattern="\d{3}-\d{2}-\d{5}"
              />
              <small className="form-help-text">
                관리자 등록번호는 필수 입력 항목입니다.
              </small>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? "처리 중..." : "완료"}
            </button>
          </form>
        </div>
      </div>

      <div className="auth-split-image">
        <img
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80"
          alt="Hotel"
        />
      </div>
    </div>
  );
};

export default AdminKakaoCompletePage;

