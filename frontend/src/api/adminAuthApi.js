import axiosClient from "./axiosClient";

const adminAuthApi = {
  login: async (credentials) => {
    return axiosClient.post("/admin/auth/login", credentials);
  },

  logout: async () => {
    // Backend에 logout 엔드포인트가 없을 수 있으므로 클라이언트에서 처리
    localStorage.removeItem("businessToken");
    return Promise.resolve({ message: "Logged out successfully" });
  },

  getMyInfo: async () => {
    return axiosClient.get("/admin/auth/me");
  },

  changePassword: async (data) => {
    // Backend에 해당 엔드포인트가 없을 수 있음 - 필요시 추가
    return axiosClient.put("/admin/auth/password", data);
  },

  forgotPassword: async (email) => {
    // Backend에 해당 엔드포인트가 없을 수 있음 - 필요시 추가
    return axiosClient.post("/admin/auth/forgot-password", { email });
  },

  signup: async (data) => {
    return axiosClient.post("/admin/auth/register", data);
  },

  updateProfile: async (data) => {
    // Backend에 해당 엔드포인트가 없을 수 있음 - 필요시 추가
    return axiosClient.put("/admin/auth/profile", data);
  },

  kakaoLogin: async (kakaoToken) => {
    // Backend에 해당 엔드포인트가 없을 수 있음 - 필요시 추가
    return axiosClient.post("/admin/auth/kakao", { access_token: kakaoToken });
  },

  completeKakaoSignup: async (data) => {
    // Backend에 해당 엔드포인트가 없을 수 있음 - 필요시 추가
    return axiosClient.post("/admin/auth/kakao/complete", data);
  },
};

export { adminAuthApi };
export default adminAuthApi;

