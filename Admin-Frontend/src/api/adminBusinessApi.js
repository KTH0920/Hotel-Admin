import axiosClient from "./axiosClient";

export const adminBusinessApi = {
  getOwners: async (params) => {
    return axiosClient.get("/admin/businesses", { params });
  },

  getOwnerById: async (id) => {
    return axiosClient.get(`/admin/businesses/${id}`);
  },

  updateOwnerStatus: async (id, status) => {
    return axiosClient.patch(`/admin/businesses/${id}/status`, { status });
  },
};

export default adminBusinessApi;

