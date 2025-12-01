import axiosClient from "./axiosClient";

export const adminStatsApi = {
  getDashboardStats: async () => {
    return axiosClient.get("/admin/dashboard/stats");
  },

  getStatistics: async (params) => {
    // Backend에 통계 엔드포인트가 하나만 있을 수 있음
    return axiosClient.get("/admin/dashboard/stats", { params });
  },

  getRevenueStats: async (period) => {
    // Backend에 세부 통계 엔드포인트가 없을 수 있음
    return axiosClient.get("/admin/dashboard/stats", { params: { period, type: "revenue" } });
  },

  getBookingStats: async (period) => {
    // Backend에 세부 통계 엔드포인트가 없을 수 있음
    return axiosClient.get("/admin/dashboard/stats", { params: { period, type: "bookings" } });
  },

  getOccupancyStats: async (period) => {
    // Backend에 세부 통계 엔드포인트가 없을 수 있음
    return axiosClient.get("/admin/dashboard/stats", { params: { period, type: "occupancy" } });
  },
};

export default adminStatsApi;

