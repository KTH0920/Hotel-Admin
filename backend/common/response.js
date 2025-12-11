// 모든 API 응답을 동일한 구조로 반환하기 위한 유틸 함수

// 성공 응답
export const successResponse = (data, message = "SUCCESS", resultCode = 200) => {
    return {
        resultCode,
        message,
        data,
    };
};

// 실패/에러 응답
export const errorResponse = (message = "FAIL", resultCode = 400, data = null) => {
    return {
        resultCode,
        message,
        data,
    };
};