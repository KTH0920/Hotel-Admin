import axiosClient from "./axiosClient";
import { mockAuthApi } from "./mockApi";

const USE_MOCK = import.meta.env.DEV;

const adminAuthApi = {
  login: async (credentials) => {
    if (USE_MOCK) {
      return mockAuthApi.login(credentials);
    }
    return axiosClient.post("/admin/auth/login", credentials);
  },

  logout: async () => {
    if (USE_MOCK) {
      return mockAuthApi.logout();
    }
    return axiosClient.post("/admin/auth/logout");
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
    return axiosClient.put("/admin/auth/password", data);
  },

  forgotPassword: async (email) => {
    if (USE_MOCK) {
      return mockAuthApi.forgotPassword(email);
    }
    return axiosClient.post("/admin/auth/forgot-password", { email });
  },

  signup: async (data) => {
    if (USE_MOCK) {
      return mockAuthApi.signup(data);
    }
    return axiosClient.post("/admin/auth/signup", data);
  },

  updateProfile: async (data) => {
    if (USE_MOCK) {
      return mockAuthApi.updateProfile(data);
    }
    return axiosClient.put("/admin/auth/profile", data);
  },

  kakaoLogin: async (kakaoToken) => {
    if (USE_MOCK) {
      return mockAuthApi.kakaoLogin(kakaoToken);
    }
    return axiosClient.post("/admin/auth/kakao", { access_token: kakaoToken });
  },

  completeKakaoSignup: async (data) => {
    if (USE_MOCK) {
      return mockAuthApi.completeKakaoSignup(data);
    }
    return axiosClient.post("/admin/auth/kakao/complete", data);
  },
};

export { adminAuthApi };
export default adminAuthApi;

