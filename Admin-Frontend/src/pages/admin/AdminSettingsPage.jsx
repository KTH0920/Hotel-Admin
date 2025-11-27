import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import AlertModal from "../../components/common/AlertModal";

// 아이콘 컴포넌트들
const SiteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const PolicyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const SecurityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const NotificationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const SETTINGS_TABS = [
  { id: "site", label: "사이트 설정", icon: <SiteIcon /> },
  { id: "policy", label: "운영 정책", icon: <PolicyIcon /> },
  { id: "security", label: "보안 설정", icon: <SecurityIcon /> },
  { id: "notifications", label: "알림 설정", icon: <NotificationIcon /> },
];

const AdminSettingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "site");
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: "", type: "info" });
  const [siteSettings, setSiteSettings] = useState({
    siteName: "호텔 예약 플랫폼",
    siteDescription: "최고의 호텔 예약 서비스",
    siteLogo: "",
    maintenanceMode: false,
    allowNewRegistrations: true,
    defaultLanguage: "ko",
  });
  const [policySettings, setPolicySettings] = useState({
    reviewPolicy: "auto",
    reportHandlingPolicy: "manual",
    businessApprovalRequired: true,
    autoApproveBusiness: false,
    maxReportCount: 3,
    reviewModeration: false,
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireStrongPassword: true,
    ipWhitelist: "",
    adminAccessLog: true,
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newBusinessAlerts: true,
    reportAlerts: true,
    systemAlerts: true,
    maintenanceAlerts: true,
  });

  useEffect(() => {
    loadSettings();
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && ["site", "policy", "security", "notifications"].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const loadSettings = () => {
    const savedSiteSettings = localStorage.getItem("adminSiteSettings");
    const savedPolicySettings = localStorage.getItem("adminPolicySettings");
    const savedSecuritySettings = localStorage.getItem("adminSecuritySettings");
    const savedNotificationSettings = localStorage.getItem("adminNotificationSettings");

    if (savedSiteSettings) setSiteSettings(JSON.parse(savedSiteSettings));
    if (savedPolicySettings) setPolicySettings(JSON.parse(savedPolicySettings));
    if (savedSecuritySettings) setSecuritySettings(JSON.parse(savedSecuritySettings));
    if (savedNotificationSettings) setNotificationSettings(JSON.parse(savedNotificationSettings));
  };

  const handleSiteSettingsChange = (field, value) => {
    const updated = { ...siteSettings, [field]: value };
    setSiteSettings(updated);
    localStorage.setItem("adminSiteSettings", JSON.stringify(updated));
    setAlertModal({ isOpen: true, message: "사이트 설정이 저장되었습니다.", type: "success" });
  };

  const handlePolicySettingsChange = (field, value) => {
    const updated = { ...policySettings, [field]: value };
    setPolicySettings(updated);
    localStorage.setItem("adminPolicySettings", JSON.stringify(updated));
    setAlertModal({ isOpen: true, message: "운영 정책이 저장되었습니다.", type: "success" });
  };

  const handleSecuritySettingsChange = (field, value) => {
    const updated = { ...securitySettings, [field]: value };
    setSecuritySettings(updated);
    localStorage.setItem("adminSecuritySettings", JSON.stringify(updated));
    setAlertModal({ isOpen: true, message: "보안 설정이 저장되었습니다.", type: "success" });
  };

  const handleNotificationSettingsChange = (field, value) => {
    const updated = { ...notificationSettings, [field]: value };
    setNotificationSettings(updated);
    localStorage.setItem("adminNotificationSettings", JSON.stringify(updated));
    setAlertModal({ isOpen: true, message: "알림 설정이 저장되었습니다.", type: "success" });
  };

  return (
    <div className="business-settings-page">
      <div className="page-header">
        <div>
          <h1>시스템 설정</h1>
          <p>전체 웹사이트 운영 및 관리 설정을 변경합니다</p>
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-tabs">
          {SETTINGS_TABS.map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchParams({ tab: tab.id });
              }}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === "site" && (
            <div className="card">
              <SiteSettingsForm
                settings={siteSettings}
                onChange={handleSiteSettingsChange}
              />
            </div>
          )}

          {activeTab === "policy" && (
            <div className="card">
              <PolicySettingsForm
                settings={policySettings}
                onChange={handlePolicySettingsChange}
              />
            </div>
          )}

          {activeTab === "security" && (
            <div className="card">
              <SecuritySettingsForm
                settings={securitySettings}
                onChange={handleSecuritySettingsChange}
              />
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="card">
              <NotificationSettingsForm
                settings={notificationSettings}
                onChange={handleNotificationSettingsChange}
              />
            </div>
          )}
        </div>
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

// 사이트 설정 폼 컴포넌트
const SiteSettingsForm = ({ settings, onChange }) => {
  return (
    <form className="form">
      <h4>기본 정보</h4>

      <div className="form-group">
        <label>사이트명</label>
        <input
          type="text"
          value={settings.siteName}
          onChange={(e) => onChange("siteName", e.target.value)}
          placeholder="웹사이트 이름"
        />
      </div>

      <div className="form-group">
        <label>사이트 설명</label>
        <textarea
          value={settings.siteDescription}
          onChange={(e) => onChange("siteDescription", e.target.value)}
          rows={3}
          placeholder="웹사이트에 대한 간단한 설명"
        />
      </div>

      <div className="form-group">
        <label>사이트 로고 URL</label>
        <input
          type="url"
          value={settings.siteLogo}
          onChange={(e) => onChange("siteLogo", e.target.value)}
          placeholder="https://example.com/logo.png"
        />
      </div>

      <div className="form-group">
        <label>기본 언어</label>
        <select
          value={settings.defaultLanguage}
          onChange={(e) => onChange("defaultLanguage", e.target.value)}
        >
          <option value="ko">한국어</option>
          <option value="en">English</option>
          <option value="ja">日本語</option>
          <option value="zh">中文</option>
        </select>
      </div>

      <h4>운영 모드</h4>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) => onChange("maintenanceMode", e.target.checked)}
          />
          <span>점검 모드 활성화</span>
        </label>
        <p className="form-help">점검 모드 시 일반 사용자는 사이트에 접근할 수 없습니다.</p>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.allowNewRegistrations}
            onChange={(e) => onChange("allowNewRegistrations", e.target.checked)}
          />
          <span>신규 회원가입 허용</span>
        </label>
        <p className="form-help">체크 해제 시 새로운 회원가입을 받지 않습니다.</p>
      </div>
    </form>
  );
};

// 운영 정책 설정 폼 컴포넌트
const PolicySettingsForm = ({ settings, onChange }) => {
  return (
    <form className="form">
      <h4>사업자 관리 정책</h4>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.businessApprovalRequired}
            onChange={(e) => onChange("businessApprovalRequired", e.target.checked)}
          />
          <span>사업자 가입 승인 필요</span>
        </label>
        <p className="form-help">체크 시 새로운 사업자 가입 시 관리자 승인이 필요합니다.</p>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.autoApproveBusiness}
            onChange={(e) => onChange("autoApproveBusiness", e.target.checked)}
            disabled={settings.businessApprovalRequired}
          />
          <span>사업자 자동 승인</span>
        </label>
        <p className="form-help">사업자 가입 시 자동으로 승인됩니다. (승인 필요가 체크 해제된 경우에만)</p>
      </div>

      <h4>리뷰 정책</h4>

      <div className="form-group">
        <label>리뷰 승인 정책</label>
        <select
          value={settings.reviewPolicy}
          onChange={(e) => onChange("reviewPolicy", e.target.value)}
        >
          <option value="auto">자동 승인</option>
          <option value="manual">수동 승인</option>
        </select>
        <p className="form-help">리뷰가 작성되면 자동으로 승인되거나 관리자 승인이 필요합니다.</p>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.reviewModeration}
            onChange={(e) => onChange("reviewModeration", e.target.checked)}
          />
          <span>리뷰 사전 검토</span>
        </label>
        <p className="form-help">리뷰가 게시되기 전에 관리자가 검토합니다.</p>
      </div>

      <h4>신고 처리 정책</h4>

      <div className="form-group">
        <label>신고 처리 방식</label>
        <select
          value={settings.reportHandlingPolicy}
          onChange={(e) => onChange("reportHandlingPolicy", e.target.value)}
        >
          <option value="manual">수동 처리</option>
          <option value="auto">자동 처리</option>
        </select>
        <p className="form-help">신고가 접수되면 관리자가 수동으로 처리하거나 자동으로 처리됩니다.</p>
      </div>

      <div className="form-group">
        <label>자동 삭제 기준 (신고 횟수)</label>
        <input
          type="number"
          min="1"
          value={settings.maxReportCount}
          onChange={(e) => onChange("maxReportCount", parseInt(e.target.value))}
          disabled={settings.reportHandlingPolicy === "manual"}
        />
        <p className="form-help">이 횟수 이상 신고되면 자동으로 삭제됩니다. (자동 처리 모드에서만 적용)</p>
      </div>
    </form>
  );
};

// 보안 설정 폼 컴포넌트
const SecuritySettingsForm = ({ settings, onChange }) => {
  return (
    <form className="form">
      <h4>인증 설정</h4>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.twoFactorAuth}
            onChange={(e) => onChange("twoFactorAuth", e.target.checked)}
          />
          <span>2단계 인증 활성화</span>
        </label>
        <p className="form-help">관리자 로그인 시 2단계 인증을 요구합니다.</p>
      </div>

      <div className="form-group">
        <label>세션 타임아웃 (분)</label>
        <input
          type="number"
          min="5"
          max="1440"
          value={settings.sessionTimeout}
          onChange={(e) => onChange("sessionTimeout", parseInt(e.target.value))}
        />
        <p className="form-help">이 시간 동안 활동이 없으면 자동으로 로그아웃됩니다.</p>
      </div>

      <h4>비밀번호 정책</h4>

      <div className="form-group">
        <label>최소 비밀번호 길이</label>
        <input
          type="number"
          min="4"
          max="32"
          value={settings.passwordMinLength}
          onChange={(e) => onChange("passwordMinLength", parseInt(e.target.value))}
        />
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.requireStrongPassword}
            onChange={(e) => onChange("requireStrongPassword", e.target.checked)}
          />
          <span>강력한 비밀번호 요구</span>
        </label>
        <p className="form-help">영문, 숫자, 특수문자를 포함한 강력한 비밀번호를 요구합니다.</p>
      </div>

      <h4>접근 제어</h4>

      <div className="form-group">
        <label>IP 화이트리스트 (선택사항)</label>
        <textarea
          value={settings.ipWhitelist}
          onChange={(e) => onChange("ipWhitelist", e.target.value)}
          rows={4}
          placeholder="각 IP를 줄바꿈으로 구분하여 입력하세요&#10;예:&#10;192.168.1.1&#10;10.0.0.1"
        />
        <p className="form-help">입력한 IP에서만 관리자 페이지에 접근할 수 있습니다. 비워두면 모든 IP에서 접근 가능합니다.</p>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.adminAccessLog}
            onChange={(e) => onChange("adminAccessLog", e.target.checked)}
          />
          <span>관리자 접근 로그 기록</span>
        </label>
        <p className="form-help">관리자의 모든 접근 및 작업을 로그로 기록합니다.</p>
      </div>
    </form>
  );
};

// 알림 설정 폼 컴포넌트
const NotificationSettingsForm = ({ settings, onChange }) => {
  return (
    <form className="form">
      <h4>알림 수신 방법</h4>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) => onChange("emailNotifications", e.target.checked)}
          />
          <span>이메일 알림 받기</span>
        </label>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.smsNotifications}
            onChange={(e) => onChange("smsNotifications", e.target.checked)}
          />
          <span>SMS 알림 받기</span>
        </label>
      </div>

      <h4>알림 종류</h4>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.newBusinessAlerts}
            onChange={(e) => onChange("newBusinessAlerts", e.target.checked)}
            disabled={!settings.emailNotifications && !settings.smsNotifications}
          />
          <span>신규 사업자 가입 알림</span>
        </label>
        <p className="form-help">새로운 사업자가 가입할 때 알림을 받습니다.</p>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.reportAlerts}
            onChange={(e) => onChange("reportAlerts", e.target.checked)}
            disabled={!settings.emailNotifications && !settings.smsNotifications}
          />
          <span>신고 접수 알림</span>
        </label>
        <p className="form-help">리뷰 신고가 접수될 때 알림을 받습니다.</p>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.systemAlerts}
            onChange={(e) => onChange("systemAlerts", e.target.checked)}
            disabled={!settings.emailNotifications && !settings.smsNotifications}
          />
          <span>시스템 알림</span>
        </label>
        <p className="form-help">시스템 오류나 중요한 이벤트 발생 시 알림을 받습니다.</p>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={settings.maintenanceAlerts}
            onChange={(e) => onChange("maintenanceAlerts", e.target.checked)}
            disabled={!settings.emailNotifications && !settings.smsNotifications}
          />
          <span>점검 알림</span>
        </label>
        <p className="form-help">시스템 점검 시작/종료 시 알림을 받습니다.</p>
      </div>
    </form>
  );
};

export default AdminSettingsPage;


