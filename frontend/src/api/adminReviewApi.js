import axiosClient from "./axiosClient";

export const adminReviewApi = {
  getReviews: async (params) => {
    return axiosClient.get("/admin/reviews", { params });
  },

  getReviewById: async (id) => {
    return axiosClient.get(`/admin/reviews/${id}`);
  },

  replyToReview: async (id, reply) => {
    return axiosClient.post(`/admin/reviews/${id}/reply`, { reply });
  },

  reportReview: async (id, reason) => {
    return axiosClient.post(`/admin/reviews/${id}/report`, { reason });
  },

  getReviewStats: async () => {
    // Backend에 해당 엔드포인트가 없을 수 있음
    const reviews = await axiosClient.get("/admin/reviews");
    const reviewList = Array.isArray(reviews) ? reviews : reviews?.data || [];
    const totalReviews = reviewList.length;
    const averageRating = reviewList.length > 0
      ? reviewList.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewList.length
      : 0;
    const ratingDistribution = reviewList.reduce((acc, r) => {
      const rating = r.rating || 0;
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {});
    return { totalReviews, averageRating, ratingDistribution };
  },

  approveReport: async (id) => {
    // 신고 승인 = 리뷰 삭제
    return axiosClient.delete(`/admin/reviews/${id}`);
  },

  rejectReport: async (id) => {
    // 신고 거부 = 리뷰 공개 처리
    return axiosClient.patch(`/admin/reviews/${id}/visibility`, { visible: true });
  },
};

export default adminReviewApi;

