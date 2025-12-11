import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const adminSchema = new mongoose.Schema({
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
        minlength: [6, '비밀번호는 6자리 이상이어야 합니다.'],
    },
    role: {
        type: String,
        enum: ['admin', 'staff'],
        default: 'staff',
    },
    name: {
        type: String,
        required: [true, '이름을 입력해주세요.'],
        trim: true,
    }
}, {
    timestamps: true
});

// 비밀번호 암호화 Hook
adminSchema.pre('save', async function (next) {
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
adminSchema.methods.comparePassword = async function (inputPassword) {
    try {
        return await bcrypt.compare(inputPassword, this.password);
    } catch (error) {
        return false;
    }
};

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;