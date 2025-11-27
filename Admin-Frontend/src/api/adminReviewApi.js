import axiosClient from "./axiosClient";
import { mockReviewApi } from "./mockApi";

const USE_MOCK = import.meta.env.DEV;

export const adminReviewApi = {
  getReviews: async (params) => {
    if (USE_MOCK) return mockReviewApi.getReviews(params);
    return axiosClient.get("/admin/reviews", { params });
  },

  getReviewById: async (id) => {
    if (USE_MOCK) return mockReviewApi.getReviewById(id);
    return axiosClient.get(`/admin/reviews/${id}`);
  },

  replyToReview: async (id, reply) => {
    if (USE_MOCK) return mockReviewApi.reply(id, reply);
    return axiosClient.post(`/admin/reviews/${id}/reply`, { reply });
  },

  reportReview: async (id, reason) => {
    if (USE_MOCK) return mockReviewApi.report(id, reason);
    return axiosClient.post(`/admin/reviews/${id}/report`, { reason });
  },

  getReviewStats: async () => {
    if (USE_MOCK) return mockReviewApi.getStats();
    return axiosClient.get("/admin/reviews/stats");
  },

  approveReport: async (id) => {
    if (USE_MOCK) return mockReviewApi.approveReport(id);
    return axiosClient.post(`/admin/reviews/${id}/report/approve`);
  },

  rejectReport: async (id) => {
    if (USE_MOCK) return mockReviewApi.rejectReport(id);
    return axiosClient.post(`/admin/reviews/${id}/report/reject`);
  },
};

export default adminReviewApi;

