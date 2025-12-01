import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, '이메일을 입력해주세요.'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, '비밀번호를 입력해주세요.'],
        minlength: 6,
        select: false, // 조회 시 기본적으로 비밀번호 제외
    },
    name: {
        type: String,
        required: [true, '이름을 입력해주세요.'],
        trim: true,
    },
    phoneNumber: {
        type: String,
        default: '',
    },
    // 관리자가 제어할 회원 상태
    status: {
        type: String,
        enum: ['active', 'banned', 'withdrawn'],
        default: 'active',
    },
    provider: {
        type: String,
        default: 'local',
    },
    role: {
        type: String,
        enum: ['user', 'business'],
        default: 'user',
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;