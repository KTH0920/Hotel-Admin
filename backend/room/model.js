import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    // 어느 숙소의 방인가? (부모 연결)
    lodging: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lodging',
        required: true,
    },
    // 객실 이름
    name: {
        type: String,
        required: true,
    },
    // 1박 가격
    price: {
        type: Number,
        required: true,
    },
    // 수용 인원
    capacity: {
        type: Number,
        required: true,
        default: 2,
    },
    // 객실 이미지
    images: [String],

    // 예약 가능 여부
    isAvailable: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);
export default Room;