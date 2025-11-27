import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("businessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // 요청 로깅
    console.log('📤 API 요청:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('❌ 요청 설정 오류:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosClient.interceptors.response.use(
  (response) => {
    // Backend 응답 형식: { resultCode, message, data }
    const backendResponse = response.data;
    
    console.log('✅ API 응답 성공:', {
      url: response.config.url,
      status: response.status,
      data: backendResponse
    });
    
    // 성공 응답인 경우 data만 반환 (API 호출부에서 편리하게 사용)
    if (backendResponse.resultCode === 200 || backendResponse.resultCode === 201) {
      return backendResponse.data || backendResponse;
    }
    
    // 에러 응답인 경우 reject
    console.warn('⚠️ Backend 에러 응답:', backendResponse);
    return Promise.reject(new Error(backendResponse.message || "요청 처리 중 오류가 발생했습니다."));
  },
  (error) => {
    // 네트워크 에러 또는 HTTP 에러
    console.error('❌ API 요청 실패:', {
      url: error.config?.url,
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      code: error.code
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem("businessToken");
      window.location.href = "/admin/login";
    }
    
    // Backend 에러 응답 형식 처리
    const errorMessage = error.response?.data?.message || error.message || "요청 처리 중 오류가 발생했습니다.";
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosClient;
