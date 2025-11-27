import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
    // 1. 프로모션 기본 정보
    title: {
        type: String,
        required: [true, '프로모션 제목을 입력해주세요.'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    imageUrl: { // S3에 업로드한 이미지 URL (배너용)
        type: String,
    },

    // 2. 쿠폰 관련 설정
    code: { // 예: SUMMER2024
        type: String,
        unique: true,
        uppercase: true, // 대문자로 자동 변환
        trim: true,
    },
    discountPercentage: { // 할인율
        type: Number,
        min: 0,
        max: 100,
    },

    // 3. 유효 기간 및 활성화 여부
    validUntil: {
        type: Date,
        required: [true, '유효 기간을 입력해주세요.'],
    },
    isActive: { // 관리자가 false로 바꾸면 사용 불가
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true
});

const Promotion = mongoose.model('Promotion', promotionSchema);
export default Promotion;