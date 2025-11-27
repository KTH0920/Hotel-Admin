import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    // 1. 예약자 정보
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    // 2. 숙소 및 객실 정보
    lodging: { // Lodging -> lodging (소문자 통일)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lodging',
        required: true,
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },

    // 3. 예약 일정 및 금액
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    guestCount: { type: Number, default: 2 },

    // 4. 예약 상태
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending',
    },

    // 5. 결제 상태
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'refunded'],
        default: 'unpaid',
    }
}, {
    timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;