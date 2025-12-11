import axiosClient from "./axiosClient";

export const adminUserApi = {
  getUsers: async (params) => {
    return axiosClient.get("/users", { params });
  },

  getUserById: async (id) => {
    return axiosClient.get(`/users/${id}`);
  },

  updateUserStatus: async (id, status) => {
    return axiosClient.patch(`/users/${id}/status`, { status });
  },
};

export default adminUserApi;

