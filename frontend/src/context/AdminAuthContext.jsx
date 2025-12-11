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
        const response = await adminAuthApi.getMyInfo();
        // axiosClient interceptor가 data만 반환하므로 직접 사용
        setAdminInfo(response);
      }
    } catch (error) {
      console.error("Check auth error:", error);
      localStorage.removeItem("businessToken");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await adminAuthApi.login(credentials);
      // axiosClient interceptor가 data만 반환하므로: { token, admin: {...} }
      const token = response.token;
      const admin = response.admin;
      
      if (!token) {
        throw new Error("토큰을 받지 못했습니다.");
      }
      
      if (!admin) {
        throw new Error("사용자 정보를 받지 못했습니다.");
      }
      
      localStorage.setItem("businessToken", token);
      setAdminInfo(admin);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
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
    try {
      const response = await adminAuthApi.kakaoLogin(kakaoToken);
      // axiosClient interceptor가 data만 반환
      
      // 추가 정보가 필요한 경우
      if (response.needsAdditionalInfo) {
        return {
          needsAdditionalInfo: true,
          tempUserId: response.tempUserId,
        };
      }
      
      // 바로 로그인 가능한 경우
      const token = response.token;
      const admin = response.admin || response.business;
      if (token) {
        localStorage.setItem("businessToken", token);
      }
      setAdminInfo(admin);
      return {
        needsAdditionalInfo: false,
      };
    } catch (error) {
      console.error("Kakao login error:", error);
      throw error;
    }
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

