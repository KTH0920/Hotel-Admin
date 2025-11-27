import axiosClient from "./axiosClient";
import { mockStatsApi } from "./mockApi";

// 환경 변수로 Mock API 사용 여부 제어 (기본값: false)
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const adminStatsApi = {
  getDashboardStats: async () => {
    if (USE_MOCK) return mockStatsApi.getDashboardStats();
    return axiosClient.get("/admin/dashboard/stats");
  },

  getStatistics: async (params) => {
    if (USE_MOCK) return mockStatsApi.getStatistics(params);
    // Backend에 통계 엔드포인트가 하나만 있을 수 있음
    return axiosClient.get("/admin/dashboard/stats", { params });
  },

  getRevenueStats: async (period) => {
    if (USE_MOCK) return mockStatsApi.getRevenueStats(period);
    // Backend에 세부 통계 엔드포인트가 없을 수 있음
    return axiosClient.get("/admin/dashboard/stats", { params: { period, type: "revenue" } });
  },

  getBookingStats: async (period) => {
    if (USE_MOCK) return mockStatsApi.getBookingStats(period);
    // Backend에 세부 통계 엔드포인트가 없을 수 있음
    return axiosClient.get("/admin/dashboard/stats", { params: { period, type: "bookings" } });
  },

  getOccupancyStats: async (period) => {
    if (USE_MOCK) return mockStatsApi.getOccupancyStats(period);
    // Backend에 세부 통계 엔드포인트가 없을 수 있음
    return axiosClient.get("/admin/dashboard/stats", { params: { period, type: "occupancy" } });
  },
};

export default adminStatsApi;

