import axiosClient from "./axiosClient";
import { mockBusinessApi } from "./mockApi";

// 환경 변수로 Mock API 사용 여부 제어 (기본값: false)
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const adminBusinessApi = {
  getOwners: async (params) => {
    if (USE_MOCK) return mockBusinessApi.getOwners(params);
    return axiosClient.get("/admin/businesses", { params });
  },

  getOwnerById: async (id) => {
    if (USE_MOCK) return mockBusinessApi.getOwnerById(id);
    return axiosClient.get(`/admin/businesses/${id}`);
  },

  updateOwnerStatus: async (id, status) => {
    if (USE_MOCK) return mockBusinessApi.updateOwnerStatus(id, status);
    return axiosClient.patch(`/admin/businesses/${id}/status`, { status });
  },
};

export default adminBusinessApi;

