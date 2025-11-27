import * as authService from './service.js'; // 확장자 .js 필수
import { successResponse, errorResponse } from '../common/response.js';

// 1. 회원가입
export const register = async (req, res) => {
    try {
        const admin = await authService.createAdmin(req.body);

        // 통일된 성공 응답 포맷 사용
        res.status(201).json(successResponse({
            adminId: admin._id,
            email: admin.email,
        }, "관리자 계정이 생성되었습니다.", 201));

    } catch (error) {
        // 통일된 에러 응답 포맷 사용
        res.status(400).json(errorResponse(error.message, 400));
    }
};

// 2. 로그인
export const login = async (req, res) => {
    try {
        console.log('🔐 로그인 시도:', { email: req.body.email });
        const { email, password } = req.body;
        
        if (!email || !password) {
            console.log('❌ 이메일 또는 비밀번호가 없음');
            return res.status(400).json(errorResponse("이메일과 비밀번호를 입력해주세요.", 400));
        }
        
        const { admin, token } = await authService.login(email, password);
        console.log('✅ 로그인 성공:', { email: admin.email, role: admin.role });

        res.status(200).json(successResponse({
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
            }
        }, "로그인 성공"));

    } catch (error) {
        console.error('❌ 로그인 에러:', error.message);
        res.status(401).json(errorResponse(error.message, 401));
    }
};

// 3. 내 정보 확인
export const getMe = async (req, res) => {
    // protect 미들웨어를 통과하면 req.user에 정보가 있음
    // 하지만 최신 정보를 위해 DB 조회를 한 번 더 하는 것이 안전함 (선택사항)
    try {
        // req.user.id는 verifyToken 미들웨어에서 넣어줌
        const admin = await authService.getAdminById(req.user.id);

        if (!admin) {
            return res.status(404).json(errorResponse("사용자를 찾을 수 없습니다.", 404));
        }

        res.status(200).json(successResponse(admin, "내 정보 조회 성공"));
    } catch (error) {
        res.status(500).json(errorResponse(error.message, 500));
    }
};