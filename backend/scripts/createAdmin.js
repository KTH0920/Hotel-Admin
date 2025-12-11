// 관리자 계정 생성 스크립트
// 사용법: node scripts/createAdmin.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../auth/model.js';

dotenv.config();

const createAdmin = async () => {
  try {
    // MongoDB 연결
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB 연결 성공');

    // 관리자 계정 정보
    const adminData = {
      email: 'admin@hotel.com',
      password: 'admin123', // 원하는 비밀번호로 변경 가능
      name: '관리자',
      role: 'admin'
    };

    // 기존 계정 확인
    const existingAdmin = await Admin.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('⚠️  이미 존재하는 이메일입니다:', adminData.email);
      console.log('기존 계정 정보:');
      console.log('- 이름:', existingAdmin.name);
      console.log('- 역할:', existingAdmin.role);
      console.log('- 생성일:', existingAdmin.createdAt);
      process.exit(0);
    }

    // 새 관리자 생성
    const admin = new Admin(adminData);
    await admin.save();

    console.log('✅ 관리자 계정이 생성되었습니다!');
    console.log('📧 이메일:', adminData.email);
    console.log('🔑 비밀번호:', adminData.password);
    console.log('👤 이름:', adminData.name);
    console.log('🎭 역할:', adminData.role);

    process.exit(0);
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
};

createAdmin();

