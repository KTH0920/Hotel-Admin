import axiosClient from "./axiosClient";

export const adminCouponApi = {
  getCoupons: async (params) => {
    return axiosClient.get("/admin/promotions", { params });
  },

  getCouponById: async (id) => {
    return axiosClient.get(`/admin/promotions/${id}`);
  },

  createCoupon: async (data) => {
    return axiosClient.post("/admin/promotions", data);
  },

  updateCoupon: async (id, data) => {
    return axiosClient.put(`/admin/promotions/${id}`, data);
  },

  deleteCoupon: async (id) => {
    return axiosClient.delete(`/admin/promotions/${id}`);
  },

  updateCouponStatus: async (id, status) => {
    // status를 isActive로 변환하여 백엔드 형식에 맞춤
    const isActive = status === "active";
    return adminCouponApi.updateCoupon(id, { isActive });
  },
};

export default adminCouponApi;

