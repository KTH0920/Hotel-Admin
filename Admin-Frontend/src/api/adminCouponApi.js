import axiosClient from "./axiosClient";
import { mockCouponApi } from "./mockApi";

const USE_MOCK = import.meta.env.DEV;

export const adminCouponApi = {
  getCoupons: async (params) => {
    if (USE_MOCK) return mockCouponApi.getCoupons(params);
    return axiosClient.get("/admin/coupons", { params });
  },

  getCouponById: async (id) => {
    if (USE_MOCK) return mockCouponApi.getCouponById(id);
    return axiosClient.get(`/admin/coupons/${id}`);
  },

  createCoupon: async (data) => {
    if (USE_MOCK) return mockCouponApi.createCoupon(data);
    return axiosClient.post("/admin/coupons", data);
  },

  updateCoupon: async (id, data) => {
    if (USE_MOCK) return mockCouponApi.updateCoupon(id, data);
    return axiosClient.put(`/admin/coupons/${id}`, data);
  },

  deleteCoupon: async (id) => {
    if (USE_MOCK) return mockCouponApi.deleteCoupon(id);
    return axiosClient.delete(`/admin/coupons/${id}`);
  },

  updateCouponStatus: async (id, status) => {
    if (USE_MOCK) return mockCouponApi.updateCouponStatus(id, status);
    return axiosClient.patch(`/admin/coupons/${id}/status`, { status });
  },
};

export default adminCouponApi;

