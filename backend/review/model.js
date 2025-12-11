import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    // 1. 관계 설정
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
    },
    lodging: { // Lodging -> lodging (소문자 통일)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lodging',
        required: true,
    },

    // 2. 리뷰 내용
    rating: {
        type: Number,
        required: [true, '평점을 입력해주세요 (1~5).'],
        min: 1,
        max: 5,
    },
    content: {
        type: String,
        required: [true, '리뷰 내용을 입력해주세요.'],
        trim: true,
    },

    // 3. 관리자 제어 및 상태 필드
    status: {
        type: String,
        enum: ['active', 'reported', 'hidden'], // 정상, 신고됨, 숨김
        default: 'active',
    },
    isVisible: {
        type: Boolean,
        default: true,
    },
    adminComment: { // 관리자 조치 메모
        type: String,
        default: '',
    },
    reportReason: { // 신고 사유
        type: String,
        default: '',
    }
}, {
    timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;