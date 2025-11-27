// common/roleMiddleware.js
import { errorResponse } from "./response.js";

// 허용된 권한(roles)을 가진 유저만 통과
// 예: authorize('admin', 'staff')
export const authorize = (...roles) => {
    return (req, res, next) => {
        // req.user는 authMiddleware에서 세팅됨
        if (!req.user) {
            return res.status(401).json(errorResponse("UNAUTHORIZED", 401));
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json(errorResponse("ACCESS_DENIED_NO_PERMISSION", 403));
        }

        next();
    };
};