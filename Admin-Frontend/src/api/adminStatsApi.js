import axiosClient from "./axiosClient";
import { mockStatsApi } from "./mockApi";

const USE_MOCK = import.meta.env.DEV;

export const adminStatsApi = {
  getDashboardStats: async () => {
    if (USE_MOCK) return mockStatsApi.getDashboardStats();
    return axiosClient.get("/admin/stats/dashboard");
  },

  getStatistics: async (params) => {
    if (USE_MOCK) return mockStatsApi.getStatistics(params);
    return axiosClient.get("/admin/stats", { params });
  },

  getRevenueStats: async (period) => {
    if (USE_MOCK) return mockStatsApi.getRevenueStats(period);
    return axiosClient.get("/admin/stats/revenue", { params: { period } });
  },

  getBookingStats: async (period) => {
    if (USE_MOCK) return mockStatsApi.getBookingStats(period);
    return axiosClient.get("/admin/stats/bookings", { params: { period } });
  },

  getOccupancyStats: async (period) => {
    if (USE_MOCK) return mockStatsApi.getOccupancyStats(period);
    return axiosClient.get("/admin/stats/occupancy", { params: { period } });
  },
};

export default adminStatsApi;

