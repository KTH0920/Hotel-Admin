import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const businessSchema = new mongoose.Schema({
    // 1. 파트너 계정 정보
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
    },
    name: {
        type: String,
        required: [true, '담당자 이름을 입력해주세요.'],
        trim: true,
    },

    // 2. 사업자 정보
    companyName: {
        type: String,
        required: [true, '상호명을 입력해주세요.'],
    },
    businessNumber: {
        type: String,
        required: [true, '사업자 등록번호를 입력해주세요.'],
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: [true, '연락처를 입력해주세요.'],
    },

    // 3. 관리자 승인 상태
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'suspended'],
        default: 'pending',
    },
    adminNotes: {
        type: String,
        trim: true,
    }
}, {
    timestamps: true
});

// 비밀번호 암호화 Hook
businessSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// 비밀번호 비교 메서드
businessSchema.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};

// 모델 생성 및 내보내기
// businessusers 컬렉션을 사용하도록 명시적으로 지정
const Business = mongoose.model('Business', businessSchema, 'businessusers');
export default Business;