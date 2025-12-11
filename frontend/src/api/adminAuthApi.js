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

  signup: async (data) => {
    return axiosClient.post("/admin/auth/register", data);
  },
};

export { adminAuthApi };
export default adminAuthApi;

