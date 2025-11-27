import { createContext, useState, useEffect } from "react";
import adminAuthApi from "../api/adminAuthApi";

export const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("businessToken");
      if (token) {
        const data = await adminAuthApi.getMyInfo();
        setAdminInfo(data);
      }
    } catch (error) {
      localStorage.removeItem("businessToken");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const data = await adminAuthApi.login(credentials);
    localStorage.setItem("businessToken", data.token);
    setAdminInfo(data.business);
  };

  const logout = async () => {
    try {
      await adminAuthApi.logout();
    } finally {
      localStorage.removeItem("businessToken");
      setAdminInfo(null);
    }
  };

  const kakaoLogin = async (kakaoToken) => {
    const data = await adminAuthApi.kakaoLogin(kakaoToken);
    
    // 추가 정보가 필요한 경우
    if (data.needsAdditionalInfo) {
      return {
        needsAdditionalInfo: true,
        tempUserId: data.tempUserId,
      };
    }
    
    // 바로 로그인 가능한 경우
    localStorage.setItem("businessToken", data.token);
    setAdminInfo(data.business);
    return {
      needsAdditionalInfo: false,
    };
  };

  return (
    <AdminAuthContext.Provider
      value={{ adminInfo, loading, login, logout, checkAuth, kakaoLogin }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContext;

