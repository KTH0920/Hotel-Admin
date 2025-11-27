import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// 공통 응답 포맷 (테스트용)
import { successResponse, errorResponse } from './common/response.js';

// === 라우트 파일 불러오기 ===
import authRoutes from './auth/route.js';
import businessRoutes from './business/route.js';
import userRoutes from './user/route.js';
import lodgingRoutes from './lodging/route.js';
import roomRoutes from './room/route.js';
import bookingRoutes from './booking/route.js';
import reviewRoutes from './review/route.js';
import categoryRoutes from './category/route.js';
import promotionRoutes from './promotion/route.js';
import dashboardRoutes from './dashboard/route.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS 설정 - Frontend origin 허용
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 요청 로깅 미들웨어 (디버깅용) - 라우트 등록 전에 배치
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.originalUrl} - ${req.url}`);
    console.log(`   Headers:`, req.headers);
    console.log(`   Body:`, req.body);
    next();
});

// === API 연결 ===
// Admin 전용 API 경로
app.use('/api/admin/auth', authRoutes);
app.use('/api/admin/businesses', businessRoutes);
app.use('/api/admin/lodgings', lodgingRoutes);
app.use('/api/admin/reviews', reviewRoutes);
app.use('/api/admin/promotions', promotionRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);

// 일반 API 경로 (필요시)
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/categories', categoryRoutes);

// 기본 경로
app.get('/', (req, res) => {
    res.json(successResponse(null, "Admin Backend Server is Running! 🚀"));
});

// 404 에러 처리
app.use((req, res, next) => {
    console.log(`❌ 404 - 경로를 찾을 수 없음: ${req.method} ${req.path}`);
    res.status(404).json(errorResponse("API 경로를 찾을 수 없습니다.", 404));
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📡 CORS 설정: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log(`🔗 API 엔드포인트: http://localhost:${PORT}/api/admin/auth/login`);
    console.log(`✅ 모든 요청이 로깅됩니다.`);
});