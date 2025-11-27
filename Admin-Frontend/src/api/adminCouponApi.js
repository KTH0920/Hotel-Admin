import axiosClient from "./axiosClient";
import { mockCouponApi } from "./mockApi";

// 환경 변수로 Mock API 사용 여부 제어 (기본값: false)
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const adminCouponApi = {
  getCoupons: async (params) => {
    if (USE_MOCK) return mockCouponApi.getCoupons(params);
    return axiosClient.get("/admin/promotions", { params });
  },

  getCouponById: async (id) => {
    if (USE_MOCK) return mockCouponApi.getCouponById(id);
    // Backend에 상세 조회 엔드포인트가 없을 수 있음 - 전체 목록에서 필터링
    const promotions = await axiosClient.get("/admin/promotions");
    const coupon = Array.isArray(promotions)
      ? promotions.find(p => p.id === id)
      : promotions?.data?.find(p => p.id === id);
    if (!coupon) {
      throw new Error("쿠폰을 찾을 수 없습니다.");
    }
    return coupon;
  },

  createCoupon: async (data) => {
    if (USE_MOCK) return mockCouponApi.createCoupon(data);
    return axiosClient.post("/admin/promotions", data);
  },

  updateCoupon: async (id, data) => {
    if (USE_MOCK) return mockCouponApi.updateCoupon(id, data);
    // Backend에 update 엔드포인트가 없을 수 있음 - 삭제 후 재생성 또는 PATCH 사용
    // 일단 DELETE 후 재생성으로 처리 (실제로는 Backend에 PUT/PATCH 추가 권장)
    await axiosClient.delete(`/admin/promotions/${id}`);
    return axiosClient.post("/admin/promotions", { ...data, id });
  },

  deleteCoupon: async (id) => {
    if (USE_MOCK) return mockCouponApi.deleteCoupon(id);
    return axiosClient.delete(`/admin/promotions/${id}`);
  },

  updateCouponStatus: async (id, status) => {
    if (USE_MOCK) return mockCouponApi.updateCouponStatus(id, status);
    // Backend에 status 업데이트 엔드포인트가 없을 수 있음
    // 일단 updateCoupon을 사용하여 처리
    return adminCouponApi.updateCoupon(id, { status });
  },
};

export default adminCouponApi;

