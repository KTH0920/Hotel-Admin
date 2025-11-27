import axiosClient from "./axiosClient";
import { mockHotelApi } from "./mockApi";

const USE_MOCK = import.meta.env.DEV;

export const adminHotelApi = {
  getMyHotel: async () => {
    if (USE_MOCK) return mockHotelApi.getMyHotel();
    return axiosClient.get("/admin/hotel");
  },

  updateHotel: async (data) => {
    if (USE_MOCK) return mockHotelApi.updateHotel(data);
    return axiosClient.put("/admin/hotel", data);
  },

  updateHotelImages: async (images) => {
    if (USE_MOCK) return mockHotelApi.updateImages(images);
    return axiosClient.put("/admin/hotel/images", { images });
  },

  getHotelStats: async () => {
    if (USE_MOCK) return mockHotelApi.getStats();
    return axiosClient.get("/admin/hotel/stats");
  },
};

export default adminHotelApi;

