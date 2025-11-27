import jwt from "jsonwebtoken";
import { errorResponse } from "./response.js"; // 확장자 .js 필수

export const verifyToken = (req, res, next) => {
    try {
        // Authorization: Bearer TOKEN 형태
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json(errorResponse("NO_TOKEN_PROVIDED", 401));
        }

        // Bearer 분리 → 실제 토큰만 추출
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json(errorResponse("INVALID_TOKEN_FORMAT", 401));
        }

        // JWT 검증
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // req.user에 담아 다음 단계에서 사용 가능
        req.user = decoded;

        next(); // 인증 성공 → 다음 컨트롤러로 이동
    } catch (err) {
        console.error("JWT ERROR:", err.message);
        // 토큰 만료 등 에러 처리
        return res.status(401).json(errorResponse("INVALID_OR_EXPIRED_TOKEN", 401));
    }
};

// (참고) 관리자 권한 체크용으로 사용하려면 이름만 바꿔서 protect라고 export 해도 됩니다.
export const protect = verifyToken;