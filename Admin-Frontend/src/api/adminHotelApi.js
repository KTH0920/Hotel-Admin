import axiosClient from "./axiosClient";
import { mockHotelApi } from "./mockApi";

// 환경 변수로 Mock API 사용 여부 제어 (기본값: false)
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const adminHotelApi = {
  getMyHotel: async () => {
    if (USE_MOCK) return mockHotelApi.getMyHotel();
    // 사업자의 숙소 목록 조회 (첫 번째 숙소 반환)
    const response = await axiosClient.get("/admin/lodgings/my");
    // 배열이면 첫 번째, 객체면 그대로 반환
    return Array.isArray(response) ? response[0] : response;
  },

  updateHotel: async (data) => {
    if (USE_MOCK) return mockHotelApi.updateHotel(data);
    // 숙소 ID가 필요하므로 먼저 내 숙소를 가져온 후 업데이트
    const myLodgings = await axiosClient.get("/admin/lodgings/my");
    const lodgingId = Array.isArray(myLodgings) ? myLodgings[0]?.id : myLodgings?.id;
    if (!lodgingId) {
      throw new Error("숙소 정보를 찾을 수 없습니다.");
    }
    return axiosClient.put(`/admin/lodgings/${lodgingId}`, data);
  },

  updateHotelImages: async (images) => {
    if (USE_MOCK) return mockHotelApi.updateImages(images);
    // 이미지 업데이트는 updateHotel에 포함시킬 수 있음
    const myLodgings = await axiosClient.get("/admin/lodgings/my");
    const lodgingId = Array.isArray(myLodgings) ? myLodgings[0]?.id : myLodgings?.id;
    if (!lodgingId) {
      throw new Error("숙소 정보를 찾을 수 없습니다.");
    }
    return axiosClient.put(`/admin/lodgings/${lodgingId}`, { images });
  },

  getHotelStats: async () => {
    if (USE_MOCK) return mockHotelApi.getStats();
    // Backend에 해당 엔드포인트가 없을 수 있음
    return axiosClient.get("/admin/dashboard/stats");
  },
};

export default adminHotelApi;

