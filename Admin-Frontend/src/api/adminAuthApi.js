import axiosClient from "./axiosClient";
import { mockAuthApi } from "./mockApi";

// 환경 변수로 Mock API 사용 여부 제어 (기본값: false)
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const adminAuthApi = {
  login: async (credentials) => {
    if (USE_MOCK) {
      console.log("⚠️ Mock API 사용 중 - 실제 Backend 호출 안 함");
      return mockAuthApi.login(credentials);
    }
    console.log("🔗 실제 Backend API 호출:", {
      url: "/admin/auth/login",
      baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
      fullURL: `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"}/admin/auth/login`,
      credentials: { email: credentials.email, password: "***" }
    });
    return axiosClient.post("/admin/auth/login", credentials);
  },

  logout: async () => {
    if (USE_MOCK) {
      return mockAuthApi.logout();
    }
    // Backend에 logout 엔드포인트가 없을 수 있으므로 클라이언트에서 처리
    localStorage.removeItem("businessToken");
    return Promise.resolve({ message: "Logged out successfully" });
  },

  getMyInfo: async () => {
    if (USE_MOCK) {
      return mockAuthApi.getMyInfo();
    }
    return axiosClient.get("/admin/auth/me");
  },

  changePassword: async (data) => {
    if (USE_MOCK) {
      return mockAuthApi.changePassword(data);
    }
    // Backend에 해당 엔드포인트가 없을 수 있음 - 필요시 추가
    return axiosClient.put("/admin/auth/password", data);
  },

  forgotPassword: async (email) => {
    if (USE_MOCK) {
      return mockAuthApi.forgotPassword(email);
    }
    // Backend에 해당 엔드포인트가 없을 수 있음 - 필요시 추가
    return axiosClient.post("/admin/auth/forgot-password", { email });
  },

  signup: async (data) => {
    if (USE_MOCK) {
      return mockAuthApi.signup(data);
    }
    return axiosClient.post("/admin/auth/register", data);
  },

  updateProfile: async (data) => {
    if (USE_MOCK) {
      return mockAuthApi.updateProfile(data);
    }
    // Backend에 해당 엔드포인트가 없을 수 있음 - 필요시 추가
    return axiosClient.put("/admin/auth/profile", data);
  },

  kakaoLogin: async (kakaoToken) => {
    if (USE_MOCK) {
      return mockAuthApi.kakaoLogin(kakaoToken);
    }
    // Backend에 해당 엔드포인트가 없을 수 있음 - 필요시 추가
    return axiosClient.post("/admin/auth/kakao", { access_token: kakaoToken });
  },

  completeKakaoSignup: async (data) => {
    if (USE_MOCK) {
      return mockAuthApi.completeKakaoSignup(data);
    }
    // Backend에 해당 엔드포인트가 없을 수 있음 - 필요시 추가
    return axiosClient.post("/admin/auth/kakao/complete", data);
  },
};

export { adminAuthApi };
export default adminAuthApi;

