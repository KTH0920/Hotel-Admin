import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    // 구분: 'amenity'(편의시설) 또는 'region'(지역)
    type: {
        type: String,
        required: [true, '카테고리 타입을 입력해주세요 (amenity/region).'],
        enum: ['amenity', 'region'],
    },
    // 이름: '와이파이', '수영장', '서울', '제주' 등
    name: {
        type: String,
        required: [true, '카테고리 이름을 입력해주세요.'],
        trim: true,
    }
}, {
    timestamps: true
});

// [중요] 중복 방지 (같은 타입 내에서 같은 이름 불가)
categorySchema.index({ type: 1, name: 1 }, { unique: true });

const Category = mongoose.model('Category', categorySchema);
export default Category;