import { useState, useEffect } from "react";

const AdminCouponForm = ({ coupon, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "percentage",
    value: 0,
    minAmount: 0,
    maxDiscount: 0,
    validFrom: "",
    validTo: "",
    usageLimit: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (coupon) {
      setFormData({
        name: coupon.name || "",
        code: coupon.code || "",
        type: coupon.type || "percentage",
        value: coupon.value || 0,
        minAmount: coupon.minAmount || 0,
        maxDiscount: coupon.maxDiscount || 0,
        validFrom: coupon.validFrom || "",
        validTo: coupon.validTo || "",
        usageLimit: coupon.usageLimit || "",
        status: coupon.status || "active",
      });
    }
  }, [coupon]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "value" || name === "minAmount" || name === "maxDiscount"
        ? Number(value) || 0
        : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "쿠폰명을 입력해주세요.";
    }

    if (!formData.code.trim()) {
      newErrors.code = "쿠폰 코드를 입력해주세요.";
    } else if (!/^[A-Z0-9_-]+$/.test(formData.code)) {
      newErrors.code = "쿠폰 코드는 영문 대문자, 숫자, 하이픈, 언더스코어만 사용 가능합니다.";
    }

    if (formData.value <= 0) {
      newErrors.value = "할인 금액 또는 비율을 입력해주세요.";
    }

    if (formData.type === "percentage" && formData.value > 100) {
      newErrors.value = "할인율은 100%를 초과할 수 없습니다.";
    }

    if (formData.validFrom && formData.validTo && formData.validFrom > formData.validTo) {
      newErrors.validTo = "종료일은 시작일보다 이후여야 합니다.";
    }

    if (!formData.validFrom) {
      newErrors.validFrom = "시작일을 입력해주세요.";
    }

    if (!formData.validTo) {
      newErrors.validTo = "종료일을 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form className="coupon-form" onSubmit={handleSubmit}>
      {/* 기본 정보 섹션 */}
      <div className="form-section">
        <h3 className="form-section-title">기본 정보</h3>
        <div className="form-section-content">
          <div className="form-group">
            <label htmlFor="name">
              쿠폰명 <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="예: 신규 회원 10% 할인"
              required
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="code">
              쿠폰 코드 <span className="required">*</span>
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="예: WELCOME10"
              required
              style={{ textTransform: "uppercase" }}
            />
            <small className="form-help-text">
              영문 대문자, 숫자, 하이픈(-), 언더스코어(_)만 사용 가능합니다.
            </small>
            {errors.code && <span className="error-text">{errors.code}</span>}
          </div>
        </div>
      </div>

      {/* 할인 설정 섹션 */}
      <div className="form-section">
        <h3 className="form-section-title">할인 설정</h3>
        <div className="form-section-content">
          <div className="form-group">
            <label>
              할인 유형 <span className="required">*</span>
            </label>
            <div className="discount-type-selector">
              <button
                type="button"
                className={`discount-type-item ${formData.type === "percentage" ? "selected" : ""}`}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, type: "percentage" }));
                  if (errors.type) {
                    setErrors((prev) => ({ ...prev, type: "" }));
                  }
                }}
              >
                <span className="discount-type-icon">%</span>
                <span className="discount-type-label">퍼센트 할인</span>
              </button>
              <button
                type="button"
                className={`discount-type-item ${formData.type === "fixed" ? "selected" : ""}`}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, type: "fixed" }));
                  if (errors.type) {
                    setErrors((prev) => ({ ...prev, type: "" }));
                  }
                }}
              >
                <span className="discount-type-icon">₩</span>
                <span className="discount-type-label">고정 금액 할인</span>
              </button>
            </div>
            {errors.type && <span className="error-text">{errors.type}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="value">
                할인 {formData.type === "percentage" ? "비율" : "금액"} <span className="required">*</span>
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="number"
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  min="0"
                  max={formData.type === "percentage" ? 100 : undefined}
                  required
                  style={{ flex: 1 }}
                />
                <span style={{ minWidth: "2rem" }}>{formData.type === "percentage" ? "%" : "원"}</span>
              </div>
              {errors.value && <span className="error-text">{errors.value}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="minAmount">최소 사용 금액</label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="number"
                  id="minAmount"
                  name="minAmount"
                  value={formData.minAmount}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  style={{ flex: 1 }}
                />
                <span style={{ minWidth: "2rem" }}>원</span>
              </div>
              <small className="form-help-text">
                이 금액 이상 구매 시 쿠폰 사용 가능
              </small>
            </div>

            {formData.type === "percentage" && (
              <div className="form-group">
                <label htmlFor="maxDiscount">최대 할인 금액</label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input
                    type="number"
                    id="maxDiscount"
                    name="maxDiscount"
                    value={formData.maxDiscount}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    style={{ flex: 1 }}
                  />
                  <span style={{ minWidth: "2rem" }}>원</span>
                </div>
                <small className="form-help-text">
                  퍼센트 할인 시 최대 할인 금액 제한
                </small>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 유효 기간 섹션 */}
      <div className="form-section">
        <h3 className="form-section-title">유효 기간</h3>
        <div className="form-section-content">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="validFrom">
                시작일 <span className="required">*</span>
              </label>
              <input
                type="date"
                id="validFrom"
                name="validFrom"
                value={formData.validFrom}
                onChange={handleChange}
                required
              />
              {errors.validFrom && <span className="error-text">{errors.validFrom}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="validTo">
                종료일 <span className="required">*</span>
              </label>
              <input
                type="date"
                id="validTo"
                name="validTo"
                value={formData.validTo}
                onChange={handleChange}
                required
                min={formData.validFrom}
              />
              {errors.validTo && <span className="error-text">{errors.validTo}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* 기타 설정 섹션 */}
      <div className="form-section">
        <h3 className="form-section-title">기타 설정</h3>
        <div className="form-section-content">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="usageLimit">사용 횟수 제한</label>
              <input
                type="number"
                id="usageLimit"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={handleChange}
                min="1"
                placeholder="제한 없음"
              />
              <small className="form-help-text">
                빈 값으로 두면 사용 횟수 제한이 없습니다.
              </small>
            </div>

            <div className="form-group">
              <label>상태</label>
              <div className="status-selector">
                <button
                  type="button"
                  className={`status-item ${formData.status === "active" ? "selected" : ""}`}
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, status: "active" }));
                  }}
                >
                  <span className="status-icon">✓</span>
                  <span className="status-label">활성</span>
                </button>
                <button
                  type="button"
                  className={`status-item ${formData.status === "inactive" ? "selected" : ""}`}
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, status: "inactive" }));
                  }}
                >
                  <span className="status-icon">○</span>
                  <span className="status-label">비활성</span>
                </button>
              </div>
              <small className="form-help-text">
                비활성 상태로 생성 시 즉시 사용할 수 없습니다.
              </small>
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "저장 중..." : coupon ? "수정" : "생성"}
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={onCancel}
          disabled={loading}
        >
          취소
        </button>
      </div>
    </form>
  );
};

export default AdminCouponForm;

