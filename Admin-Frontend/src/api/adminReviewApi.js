import axiosClient from "./axiosClient";
import { mockReviewApi } from "./mockApi";

// 환경 변수로 Mock API 사용 여부 제어 (기본값: false)
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const adminReviewApi = {
  getReviews: async (params) => {
    if (USE_MOCK) return mockReviewApi.getReviews(params);
    return axiosClient.get("/admin/reviews", { params });
  },

  getReviewById: async (id) => {
    if (USE_MOCK) return mockReviewApi.getReviewById(id);
    // Backend에 상세 조회 엔드포인트가 없을 수 있음 - 전체 목록에서 필터링
    const reviews = await axiosClient.get("/admin/reviews");
    const review = Array.isArray(reviews) 
      ? reviews.find(r => r.id === id) 
      : reviews?.data?.find(r => r.id === id);
    if (!review) {
      throw new Error("리뷰를 찾을 수 없습니다.");
    }
    return review;
  },

  replyToReview: async (id, reply) => {
    if (USE_MOCK) return mockReviewApi.reply(id, reply);
    // Backend에 reply 엔드포인트가 없을 수 있음 - 필요시 추가
    return axiosClient.post(`/admin/reviews/${id}/reply`, { reply });
  },

  reportReview: async (id, reason) => {
    if (USE_MOCK) return mockReviewApi.report(id, reason);
    return axiosClient.post(`/admin/reviews/${id}/report`, { reason });
  },

  getReviewStats: async () => {
    if (USE_MOCK) return mockReviewApi.getStats();
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
    if (USE_MOCK) return mockReviewApi.approveReport(id);
    // 신고 승인 = 리뷰 삭제
    return axiosClient.delete(`/admin/reviews/${id}`);
  },

  rejectReport: async (id) => {
    if (USE_MOCK) return mockReviewApi.rejectReport(id);
    // 신고 거부 = 리뷰 공개 처리
    return axiosClient.patch(`/admin/reviews/${id}/visibility`, { visible: true });
  },
};

export default adminReviewApi;

