import Admin from './model.js'; // 확장자 .js 필수
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// dotenv 로드 (index.js에서 이미 로드되지만, 여기서도 확실히 하기 위해)
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('⚠️ JWT_SECRET이 .env 파일에서 로드되지 않았습니다!');
}

// 내부 함수: 토큰 생성기
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, JWT_SECRET, {
        expiresIn: '1d',
    });
};

// 서비스 1: 관리자 생성
export const createAdmin = async ({ email, password, name, role }) => {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        throw new Error('이미 사용 중인 이메일입니다.');
    }

    const admin = new Admin({ email, password, name, role });
    await admin.save();
    return admin;
};

// 서비스 2: 로그인
export const login = async (email, password) => {
    const admin = await Admin.findOne({ email });
    if (!admin) {
        throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
        throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');
    }

    if (!JWT_SECRET) {
        console.error('❌ JWT_SECRET이 설정되지 않음!');
        throw new Error('서버 설정 오류가 발생했습니다.');
    }

    const token = generateToken(admin._id, admin.role);
    
    return { admin, token };
};

// 서비스 3: ID로 찾기
export const getAdminById = async (id) => {
    const admin = await Admin.findById(id).select('-password');
    return admin;
};