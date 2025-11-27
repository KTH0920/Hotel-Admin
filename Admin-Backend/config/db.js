import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        // [수정] .env 파일에 적힌 이름(MONGODB_URI) 그대로 사용
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`❌ MongoDB Connection Failed: ${err.message}`);
        process.exit(1); // 연결 실패 시 서버 종료
    }
};